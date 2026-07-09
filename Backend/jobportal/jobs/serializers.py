from rest_framework import serializers
from .models import Job
from applications.models import Application


class JobSerializer(serializers.ModelSerializer):

    has_applied = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = "__all__"
        read_only_fields = ["recruiter"]

    def get_has_applied(self, obj):
        request = self.context.get("request")

        if not request or not request.user.is_authenticated:
            return False

        return Application.objects.filter(
            job=obj,
            applicant=request.user
        ).exists()