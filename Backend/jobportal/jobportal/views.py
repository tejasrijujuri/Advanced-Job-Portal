from django.http import HttpResponse
from .utils.email_utils import send_template_email


def send_job_alert(request):
    send_template_email(
        "New Job Alert",
        "emails/job_alert.txt",
        {
            "name": "Teja",
            "job_title": "Python Developer",
        },
        ["user@gmail.com"]
    )

    return HttpResponse("Email sent")