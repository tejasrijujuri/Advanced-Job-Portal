from django.db import models
from accounts.models import User


class Recruiter(models.Model):

    user = models.OneToOneField(User, on_delete=models.CASCADE)

    company_name = models.CharField(max_length=200)

    company_email = models.EmailField(unique=True)

    company_phone = models.CharField(max_length=15)

    company_website = models.URLField(blank=True, null=True)

    company_address = models.TextField()

    company_description = models.TextField()

    company_logo = models.ImageField(
        upload_to='company_logos/',
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.company_name
# Create your models here.
