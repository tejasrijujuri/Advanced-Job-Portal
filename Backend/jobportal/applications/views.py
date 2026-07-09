from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response

from notifications.models import Notification
from interviews.models import Interview

from .models import Application
from .serializers import ApplicationSerializer
from jobportal.utils.email_utils import send_template_email


class ApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        queryset = (
            Application.objects.select_related(
                "job",
                "applicant",
                "applicant__profile",
            )
            .prefetch_related("applicant__resumes")
            .order_by("-applied_at")
        )

        if user.role == "jobseeker":
            return queryset.filter(applicant=user)

        if user.role == "recruiter":
            return queryset.filter(job__recruiter=user)

        return queryset

    def perform_create(self, serializer):
        application = serializer.save(applicant=self.request.user)

        Notification.objects.create(
            user=application.job.recruiter,
            message=f"New application for {application.job.title}",
        )

    # =====================================================
    # Recruiter -> Applications of One Job
    # =====================================================
    @action(detail=False, methods=["get"], url_path=r"job/(?P<job_id>[^/.]+)")
    def job_applications(self, request, job_id=None):

        applications = (
            Application.objects.filter(
                job_id=job_id,
                job__recruiter=request.user,
            )
            .select_related(
                "job",
                "applicant",
                "applicant__profile",
            )
            .prefetch_related("applicant__resumes")
            .order_by("-applied_at")
        )

        data = []

        for app in applications:

            profile = getattr(app.applicant, "profile", None)
            resume = app.applicant.resumes.order_by("-uploaded_at").first()
            interview = Interview.objects.filter(application=app).first()

            data.append({
                "id": app.id,
                "application_id": app.id,

                "job": app.job.id,
                "job_title": app.job.title,
                "company": app.job.company,
                "location": app.job.location,

                "candidate": app.applicant.username,
                "email": app.applicant.email,

                "status": app.status,
                "applied_at": app.applied_at,

                "full_name": profile.full_name if profile else "",
                "mobile": profile.mobile if profile else "",
                "photo": profile.photo.url if profile and profile.photo else None,
                "education": profile.highest_education if profile else "",
                "percentage": profile.percentage if profile else "",
                "profile_skills": profile.skills if profile else "",
                "projects": profile.projects if profile else "",
                "experience": profile.experience if profile else "",

                "resume_file": (
                    resume.resume_file.url
                    if resume and resume.resume_file
                    else None
                ),

                "resume_skills": resume.skills if resume else "",
                "current_company": resume.current_company if resume else "",
                "current_role": resume.current_role if resume else "",
                "expected_salary": resume.expected_salary if resume else None,
                "preferred_location": resume.preferred_location if resume else "",
                "notice_period": resume.notice_period if resume else "",
                "languages": resume.languages_known if resume else "",
                "linkedin": resume.linkedin_url if resume else "",
                "github": resume.github_url if resume else "",
                "portfolio": resume.portfolio_url if resume else "",

                "interviews": (
                    [{
                        "id": interview.id,
                        "mode": interview.mode,
                        "interview_date": interview.interview_date,
                        "meeting_link": interview.meeting_link,
                        "location": interview.location,
                        "status": interview.status,
                    }]
                    if interview else []
                ),
            })

        return Response(data)

    # =====================================================
    # Update Status
    # =====================================================
    @action(detail=True, methods=["patch"])
    def update_status(self, request, pk=None):

        application = self.get_object()

        if application.job.recruiter != request.user:
            return Response(
                {"error": "Permission denied."},
                status=403,
            )

        new_status = request.data.get("status")

        valid_statuses = [
            "applied",
            "shortlisted",
            "selected",
            "rejected",
        ]

        if new_status not in valid_statuses:
            return Response(
                {"error": "Invalid status."},
                status=400,
            )

        old_status = application.status
        application.status = new_status
        application.save()

        if old_status != new_status:

            Notification.objects.create(
                user=application.applicant,
                message=(
                    f"Your application for {application.job.title} "
                    f"is now {application.get_status_display()}"
                ),
            )

            try:
                send_template_email(
                    subject="Application Status Updated",
                    template_name="emails/application_status.txt",
                    context={
                        "name": application.applicant.username,
                        "job_title": application.job.title,
                        "status": application.get_status_display(),
                    },
                    recipient_list=[application.applicant.email],
                )
            except Exception as e:
                print("EMAIL ERROR:", e)

        return Response({
            "message": "Application updated successfully",
            "status": application.status,
        })

        # =====================================================
    # Job Seeker -> Withdraw Application
    # =====================================================
    @action(detail=True, methods=["delete"])
    def withdraw(self, request, pk=None):

        application = self.get_object()

        # Only the applicant can withdraw
        if application.applicant != request.user:
            return Response(
                {"error": "Permission denied."},
                status=403,
            )

        # Optional: prevent withdrawing after selection
        if application.status == "selected":
            return Response(
                {
                    "error": "Selected applications cannot be withdrawn."
                },
                status=400,
            )

        job_title = application.job.title
        recruiter = application.job.recruiter

        application.delete()

        Notification.objects.create(
            user=recruiter,
            message=f"Application withdrawn for {job_title}",
        )

        return Response(
            {"message": "Application withdrawn successfully."},
            status=200,
        )

    # =====================================================
    # Candidate Profile
    # =====================================================
    @action(detail=True, methods=["get"], url_path="candidate-profile")
    def candidate_profile(self, request, pk=None):

        application = self.get_object()

        if request.user != application.job.recruiter:
            return Response(
                {"error": "Permission denied"},
                status=403,
            )

        applicant = application.applicant
        profile = getattr(applicant, "profile", None)
        resume = applicant.resumes.order_by("-uploaded_at").first()

        interview = Interview.objects.filter(
            application=application
        ).first()

        return Response({
            "application_id": application.id,

            "candidate": applicant.username,
            "email": applicant.email,

            "full_name": profile.full_name if profile else "",
            "mobile": profile.mobile if profile else "",

            "photo": profile.photo.url if profile and profile.photo else None,

            "education": profile.highest_education if profile else "",
            "percentage": profile.percentage if profile else "",
            "profile_skills": profile.skills if profile else "",
            "projects": profile.projects if profile else "",
            "experience": profile.experience if profile else "",

            "resume_file": (
                resume.resume_file.url
                if resume and resume.resume_file
                else None
            ),

            "resume_skills": resume.skills if resume else "",
            "current_company": resume.current_company if resume else "",
            "current_role": resume.current_role if resume else "",
            "expected_salary": resume.expected_salary if resume else None,
            "preferred_location": resume.preferred_location if resume else "",
            "notice_period": resume.notice_period if resume else "",
            "languages": resume.languages_known if resume else "",
            "linkedin": resume.linkedin_url if resume else "",
            "github": resume.github_url if resume else "",
            "portfolio": resume.portfolio_url if resume else "",

            "interview_scheduled": interview is not None,

            "interview": (
                {
                    "id": interview.id,
                    "mode": interview.mode,
                    "date": interview.interview_date,
                    "meeting_link": interview.meeting_link,
                    "location": interview.location,
                    "status": interview.status,
                }
                if interview else None
            ),
        })