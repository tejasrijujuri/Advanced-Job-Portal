from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from accounts.models import User
from jobs.models import Job
from applications.models import Application
from interviews.models import Interview


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def dashboard(request):

    if not request.user.is_staff:
        return Response(
            {"error": "Admin only"},
            status=403
        )

    return Response({
        "total_users": User.objects.count(),
        "total_recruiters": User.objects.filter(role="recruiter").count(),
        "total_jobseekers": User.objects.filter(role="jobseeker").count(),

        "total_jobs": Job.objects.count(),
        "total_applications": Application.objects.count(),
        "total_interviews": Interview.objects.count(),

        "recent_jobs": [
            {
                "id": job.id,
                "title": job.title,
                "company": job.company
            }
            for job in Job.objects.order_by("-created_at")[:5]
        ],

        "recent_applications": [
            {
                "id": app.id,
                "candidate": app.applicant.username,
                "job": app.job.title,
                "status": app.status
            }
            for app in Application.objects.order_by("-applied_at")[:5]
        ]
    })