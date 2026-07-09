from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings


def send_template_email(
    subject,
    template_name,
    context,
    recipient_list,
    html_template=None,
):
    text_content = render_to_string(template_name, context)

    email = EmailMultiAlternatives(
        subject=subject,
        body=text_content,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=recipient_list,
    )

    if html_template:
        html_content = render_to_string(html_template, context)
        email.attach_alternative(html_content, "text/html")

    email.send()