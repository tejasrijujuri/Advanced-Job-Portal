from django.db import models


class Application(models.Model):

    STATUS_CHOICES = (
        ('Applied', 'Applied'),
        ('Shortlisted', 'Shortlisted'),
        ('Rejected', 'Rejected'),
        ('Selected', 'Selected'),
    )

    applicant_name = models.CharField(max_length=100)
    applicant_email = models.EmailField()
    job_title = models.CharField(max_length=200)
    company_name = models.CharField(max_length=200)
    resume = models.FileField(upload_to='resumes/')
    cover_letter = models.TextField(blank=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='Applied'
    )
    applied_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.applicant_name} - {self.job_title}"
# Create your models here.
