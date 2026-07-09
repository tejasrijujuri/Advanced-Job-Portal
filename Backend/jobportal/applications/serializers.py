from rest_framework import serializers
from .models import Application


class ApplicationSerializer(serializers.ModelSerializer):
    # Job Details
    job_title = serializers.CharField(source="job.title", read_only=True)
    company = serializers.CharField(source="job.company", read_only=True)
    location = serializers.CharField(source="job.location", read_only=True)

    # Candidate Details
    candidate = serializers.CharField(source="applicant.username", read_only=True)
    email = serializers.CharField(source="applicant.email", read_only=True)

    full_name = serializers.SerializerMethodField()
    mobile = serializers.SerializerMethodField()

    # Resume
    resume_file = serializers.SerializerMethodField()

    def get_full_name(self, obj):
        profile = getattr(obj.applicant, "profile", None)
        return profile.full_name if profile else ""

    def get_mobile(self, obj):
        profile = getattr(obj.applicant, "profile", None)
        return profile.mobile if profile else ""

    def get_resume_file(self, obj):
        resume = obj.applicant.resumes.order_by("-uploaded_at").first()

        if resume and resume.resume_file:
            request = self.context.get("request")
            url = resume.resume_file.url

            if request:
                return request.build_absolute_uri(url)

            return url

        return None

    class Meta:
        model = Application
        fields = [
            "id",
            "job",
            "job_title",
            "company",
            "location",

            "candidate",
            "email",
            "full_name",
            "mobile",

            "resume_file",

            "status",
            "applied_at",
        ]