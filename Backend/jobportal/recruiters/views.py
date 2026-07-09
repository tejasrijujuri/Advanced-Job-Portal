from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from jobs.models import Job
from applications.models import Application
from interviews.models import Interview


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def recruiter_analytics(request):
    user = request.user

    jobs = Job.objects.filter(created_by=user)
    applications = Application.objects.filter(job__created_by=user)
    interviews = Interview.objects.filter(job__created_by=user)

    return Response({
        "total_jobs": jobs.count(),
        "total_applications": applications.count(),
        "total_interviews": interviews.count(),

        "applications_status": {
            "pending": applications.filter(status="pending").count(),
            "accepted": applications.filter(status="accepted").count(),
            "rejected": applications.filter(status="rejected").count(),
        },

        "interviews_status": {
            "scheduled": interviews.filter(status="scheduled").count(),
            "completed": interviews.filter(status="completed").count(),
            "cancelled": interviews.filter(status="cancelled").count(),
        }
    })