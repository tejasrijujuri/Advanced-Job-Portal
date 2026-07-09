from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User, Profile, RecruiterProfile


@receiver(post_save, sender=User)
def create_user_profiles(sender, instance, created, **kwargs):
    if created:
        if instance.role == "recruiter":
            RecruiterProfile.objects.get_or_create(user=instance)
        else:
            Profile.objects.get_or_create(user=instance)