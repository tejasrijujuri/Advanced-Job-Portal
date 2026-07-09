from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from jobs.models import Job
from applications.models import Application
from interviews.models import Interview


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def recruiter_stats(request):
    user = request.user

    if user.role != "recruiter":
        return Response({"error": "Only recruiters allowed"}, status=403)

    jobs = Job.objects.filter(recruiter=user)
    applications = Application.objects.filter(job__recruiter=user)
    interviews = Interview.objects.filter(application__job__recruiter=user)

    return Response({
        "total_jobs": jobs.count(),
        "total_applications": applications.count(),
        "total_interviews": interviews.count(),

        "applications_status": {
            "pending": applications.filter(status="applied").count(),
            "accepted": applications.filter(status="selected").count(),
            "rejected": applications.filter(status="rejected").count(),
        },

        "interviews_status": {
            "scheduled": interviews.filter(status="scheduled").count(),
            "completed": interviews.filter(status="completed").count(),
            "cancelled": interviews.filter(status="cancelled").count(),
        },

        "job_wise": [
            {
                "title": job.title,
                "applications": Application.objects.filter(job=job).count(),
            }
            for job in jobs
        ]
    })