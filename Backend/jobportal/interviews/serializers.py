from rest_framework import serializers
from .models import Interview


class InterviewSerializer(serializers.ModelSerializer):

    job_title = serializers.CharField(source="application.job.title", read_only=True)
    company = serializers.CharField(source="application.job.company", read_only=True)

    class Meta:
        model = Interview
        fields = [
            "id",
            "application",
            "job_title",
            "company",
            "interview_date",
            "mode",
            "location",
            "meeting_link",
            "status",
            "created_at",
        ]

    def validate(self, data):
        instance = getattr(self, "instance", None)
        mode = data.get("mode") or getattr(instance, "mode", None)

        if mode == "offline":
            if not data.get("location") and not getattr(instance, "location", None):
                raise serializers.ValidationError(
                    {"location": "Location required for offline interview"}
                )

            data["meeting_link"] = None

        elif mode == "online":
            data["location"] = None

        return data