from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response

from notifications.models import Notification
from .models import Job
from .serializers import JobSerializer
from applications.models import Application
from jobportal.utils.email_utils import send_template_email


class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    # ✅ ADD THIS
    def get_serializer_context(self):
        return {"request": self.request}

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsAuthenticated()]
        return super().get_permissions()

    def get_queryset(self):
        queryset = Job.objects.all().order_by("-created_at")

        title = self.request.query_params.get("title")
        company = self.request.query_params.get("company")
        location = self.request.query_params.get("location")

        min_salary = self.request.query_params.get("min_salary")
        max_salary = self.request.query_params.get("max_salary")

        if title:
            queryset = queryset.filter(title__icontains=title)

        if company:
            queryset = queryset.filter(company__icontains=company)

        if location:
            queryset = queryset.filter(location__icontains=location)

        if min_salary:
            queryset = queryset.filter(salary__gte=min_salary)

        if max_salary:
            queryset = queryset.filter(salary__lte=max_salary)

        if self.request.query_params.get("mine") == "true":
            if self.request.user.is_authenticated:
                queryset = queryset.filter(recruiter=self.request.user)
            else:
                return Job.objects.none()

        return queryset

    def perform_create(self, serializer):
        serializer.save(recruiter=self.request.user)

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def apply(self, request, pk=None):
        job = self.get_object()

        if Application.objects.filter(job=job, applicant=request.user).exists():
            return Response({"error": "Already applied"}, status=400)

        application = Application.objects.create(
            job=job,
            applicant=request.user,
            cover_letter=request.data.get("cover_letter", "")
        )

        Notification.objects.create(
            user=job.recruiter,
            message=f"New application for {job.title}"
        )

        return Response({
            "message": "Applied successfully",
            "application_id": application.id
        }, status=201)