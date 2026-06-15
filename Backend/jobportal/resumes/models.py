from django.db import models
from accounts.models import User


class Resume(models.Model):

    user = models.ForeignKey(User, on_delete=models.CASCADE)

    resume = models.FileField(upload_to='resumes/')

    skills = models.TextField()

    education = models.TextField()

    experience = models.TextField()

    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username
# Create your models here.
