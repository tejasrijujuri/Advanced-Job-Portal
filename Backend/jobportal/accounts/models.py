from django.db import models


class User(models.Model):

    ROLE_CHOICES = (
        ('Job Seeker', 'Job Seeker'),
        ('Recruiter', 'Recruiter'),
    )

    first_name = models.CharField(max_length=100)

    last_name = models.CharField(max_length=100)

    username = models.CharField(max_length=100, unique=True)

    email = models.EmailField(unique=True)

    phone = models.CharField(max_length=15)

    password = models.CharField(max_length=255)

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='Job Seeker'
    )

    # Profile Image
    profile_image = models.ImageField(
        upload_to='profiles/',
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.username