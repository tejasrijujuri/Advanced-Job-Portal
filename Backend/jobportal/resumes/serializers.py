from rest_framework import serializers
from .models import Resume


class ResumeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Resume
        fields = "__all__"
        read_only_fields = ["user", "uploaded_at", "updated_at"]

    def validate_resume_file(self, value):
        if not value.name.endswith(".pdf"):
            raise serializers.ValidationError("Only PDF files are allowed.")
        return value