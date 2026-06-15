from django.db import models


class Notification(models.Model):

    NOTIFICATION_TYPE = (
        ('Job Alert', 'Job Alert'),
        ('Application', 'Application'),
        ('Interview', 'Interview'),
        ('System', 'System'),
    )

    title = models.CharField(max_length=200)

    message = models.TextField()

    notification_type = models.CharField(
        max_length=30,
        choices=NOTIFICATION_TYPE
    )

    receiver = models.CharField(max_length=100)

    is_read = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
# Create your models here.
