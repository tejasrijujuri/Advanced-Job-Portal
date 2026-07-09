from django.db import models
from django.conf import settings
from .validators import validate_resume


class Resume(models.Model):

    EXPERIENCE_CHOICES = (
        ("fresher", "Fresher"),
        ("0-1", "0-1 Years"),
        ("1-3", "1-3 Years"),
        ("3-5", "3-5 Years"),
        ("5+", "5+ Years"),
    )

    NOTICE_PERIOD_CHOICES = (
        ("immediate", "Immediate"),
        ("15_days", "15 Days"),
        ("30_days", "30 Days"),
        ("60_days", "60 Days"),
        ("90_days", "90 Days"),
    )

    # ✅ FIXED: allow multiple resumes
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="resumes"
    )

    resume_file = models.FileField(
    upload_to="resumes/",
    validators=[validate_resume],
    null=True,
    blank=True
    )

    skills = models.TextField(blank=True)

    experience = models.CharField(
        max_length=20,
        choices=EXPERIENCE_CHOICES,
        default="fresher"
    )

    current_company = models.CharField(max_length=255, blank=True)
    current_role = models.CharField(max_length=255, blank=True)
    education = models.CharField(max_length=255, blank=True)

    expected_salary = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )

    preferred_location = models.CharField(max_length=255, blank=True)

    notice_period = models.CharField(
        max_length=20,
        choices=NOTICE_PERIOD_CHOICES,
        default="immediate"
    )

    certifications = models.TextField(blank=True)
    projects = models.TextField(blank=True)
    languages_known = models.CharField(max_length=255, blank=True)

    linkedin_url = models.URLField(blank=True)
    github_url = models.URLField(blank=True)
    portfolio_url = models.URLField(blank=True)

    uploaded_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Resume"
        verbose_name_plural = "Resumes"

    def __str__(self):
        return f"{self.user.username} - Resume {self.id}"