from rest_framework import serializers
from .models import SavedJob
from jobs.models import Job
from jobs.serializers import JobSerializer


class SavedJobSerializer(serializers.ModelSerializer):
    job = JobSerializer(read_only=True)

    job_id = serializers.PrimaryKeyRelatedField(
        queryset=Job.objects.all(),
        source="job",
        write_only=True
    )

    class Meta:
        model = SavedJob
        fields = [
            "id",
            "job",
            "job_id",
            "user",
            "saved_at",
        ]
        read_only_fields = [
            "user",
            "saved_at",
        ]