from django.db import models


class Interview(models.Model):

    STATUS_CHOICES = (
        ('Scheduled', 'Scheduled'),
        ('Completed', 'Completed'),
        ('Cancelled', 'Cancelled'),
    )

    applicant_name = models.CharField(max_length=100)
    applicant_email = models.EmailField()

    company_name = models.CharField(max_length=200)

    job_title = models.CharField(max_length=200)

    interviewer_name = models.CharField(max_length=100)

    interview_date = models.DateField()

    interview_time = models.TimeField()

    interview_mode = models.CharField(
        max_length=20,
        choices=(
            ('Online', 'Online'),
            ('Offline', 'Offline'),
        )
    )

    meeting_link = models.URLField(blank=True)

    venue = models.CharField(
        max_length=255,
        blank=True
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='Scheduled'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.applicant_name
# Create your models here.
