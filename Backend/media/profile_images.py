from django.db import models

class User(models.Model):
    full_name = models.CharField(max_length=100)

    profile_image = models.ImageField(
        upload_to='profiles/',
        blank=True,
        null=True
    )