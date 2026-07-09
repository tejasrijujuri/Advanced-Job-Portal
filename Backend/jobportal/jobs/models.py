from django.db import models
from django.conf import settings


class Job(models.Model):

    JOB_TYPES = (
        ('full-time', 'Full Time'),
        ('part-time', 'Part Time'),
        ('internship', 'Internship'),
    )

    title = models.CharField(max_length=255)

    company = models.CharField(max_length=255)

    location = models.CharField(max_length=255)

    description = models.TextField()

    skills = models.TextField()

    salary = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )

    job_type = models.CharField(
        max_length=20,
        choices=JOB_TYPES
    )

    recruiter = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title