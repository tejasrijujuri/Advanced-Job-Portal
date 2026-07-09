import uuid
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.core.mail import send_mail

from .models import Interview
from .serializers import InterviewSerializer


class InterviewViewSet(viewsets.ModelViewSet):

    serializer_class = InterviewSerializer
    permission_classes = [IsAuthenticated]

    # -------------------------
    # GET INTERVIEWS
    # -------------------------
    def get_queryset(self):
        user = self.request.user

        if user.role == "recruiter":
            return Interview.objects.filter(
                application__job__recruiter=user
            ).order_by("-created_at")

        return Interview.objects.filter(
            application__applicant=user
        ).order_by("-created_at")

    # -------------------------
    # CREATE INTERVIEW
    # -------------------------
    def perform_create(self, serializer):

        interview = serializer.save()
        app = interview.application
        applicant = app.applicant
        mode = interview.mode

        # =========================
        # ONLINE → generate meeting link
        # =========================
        if mode == "online":
            code = f"{uuid.uuid4().hex[:3]}-{uuid.uuid4().hex[:4]}-{uuid.uuid4().hex[:3]}"
            interview.meeting_link = f"https://meet.google.com/{code}"
            interview.location = None

        # =========================
        # OFFLINE → no meeting link
        # =========================
        elif mode == "offline":
            interview.meeting_link = None

        interview.save()

        # =========================
        # EMAIL
        # =========================
        if applicant.email:
            try:
                message = f"""
Hello {applicant.username},

Your interview is scheduled.

Job: {app.job.title}
Date: {interview.interview_date}
Mode: {mode}
"""

                if mode == "online" and interview.meeting_link:
                    message += f"\nMeeting Link: {interview.meeting_link}"

                if mode == "offline" and interview.location:
                    message += f"\nLocation: {interview.location}"

                send_mail(
                    subject=f"Interview Scheduled - {app.job.title}",
                    message=message,
                    from_email="advancedjobportal@gmail.com",
                    recipient_list=[applicant.email],
                    fail_silently=True,
                )

            except Exception as e:
                print("EMAIL ERROR:", str(e))

    # -------------------------
    # STATUS UPDATE
    # -------------------------
    @action(detail=True, methods=["patch"])
    def update_status(self, request, pk=None):

        interview = self.get_object()

        if interview.application.job.recruiter != request.user:
            return Response({"error": "Permission denied"}, status=403)

        new_status = request.data.get("status")

        if new_status not in ["scheduled", "completed", "cancelled"]:
            return Response({"error": "Invalid status"}, status=400)

        interview.status = new_status
        interview.save()

        return Response({
            "message": "Updated successfully",
            "status": interview.status
        })

    # -------------------------
    # RECRUITER LIST
    # -------------------------
    @action(detail=False, methods=["get"], url_path="recruiter")
    def recruiter_interviews(self, request):

        if request.user.role != "recruiter":
            return Response([], status=403)

        interviews = Interview.objects.filter(
            application__job__recruiter=request.user
        ).order_by("-created_at")

        serializer = self.get_serializer(interviews, many=True)
        return Response(serializer.data)