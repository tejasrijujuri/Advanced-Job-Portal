from datetime import timedelta

from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


# =========================
# USER MODEL
# =========================
class User(AbstractUser):
    ROLE_CHOICES = (
        ("jobseeker", "Job Seeker"),
        ("recruiter", "Recruiter"),
        ("admin", "Admin"),
    )

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default="jobseeker",
    )

    phone = models.CharField(max_length=15, blank=True)

    def __str__(self):
        return self.username


# =========================
# PASSWORD RESET OTP
# =========================
class PasswordResetOTP(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
    )

    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    is_verified = models.BooleanField(default=False)

    def is_expired(self):
        return timezone.now() > self.created_at + timedelta(minutes=5)

    def __str__(self):
        return f"{self.user.username} - {self.otp}"


# =========================
# PROFILE MODEL
# =========================
class Profile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile",
    )

    full_name = models.CharField(max_length=255, blank=True)
    mobile = models.CharField(max_length=20, blank=True)

    photo = models.ImageField(
        upload_to="profiles/",
        blank=True,
        null=True,
    )

    resume = models.FileField(
        upload_to="resumes/",
        blank=True,
        null=True,
    )

    certificates = models.FileField(
        upload_to="certificates/",
        blank=True,
        null=True,
    )

    highest_education = models.CharField(max_length=255, blank=True)
    percentage = models.CharField(max_length=20, blank=True)

    skills = models.TextField(blank=True)
    experience = models.TextField(blank=True)
    projects = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.full_name or self.user.username


# =========================
# RECRUITER PROFILE
# =========================
class RecruiterProfile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="recruiterprofile",
    )

    company_name = models.CharField(max_length=200, blank=True, null=True)
    designation = models.CharField(max_length=100, blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    industry = models.CharField(max_length=100, blank=True, null=True)
    company_size = models.CharField(max_length=50, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    logo = models.ImageField(upload_to="company_logos/", blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.company_name or self.user.username