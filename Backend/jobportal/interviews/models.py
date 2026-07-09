from django.db import models
from applications.models import Application


class Interview(models.Model):

    STATUS_CHOICES = (
        ("scheduled", "Scheduled"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    )

    MODE_CHOICES = (
        ("online", "Online"),
        ("offline", "Offline"),
    )

    application = models.ForeignKey(
        Application,
        on_delete=models.CASCADE,
        related_name="interviews"
    )

    interview_date = models.DateTimeField()

    mode = models.CharField(
        max_length=10,
        choices=MODE_CHOICES,
        default="offline"
    )

    location = models.CharField(max_length=255, blank=True, null=True)
    meeting_link = models.URLField(blank=True, null=True)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="scheduled"
    )

    created_at = models.DateTimeField(auto_now_add=True)