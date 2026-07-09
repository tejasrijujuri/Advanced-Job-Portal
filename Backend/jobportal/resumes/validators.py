from django.core.exceptions import ValidationError
import os


def validate_resume(value):
    allowed_extensions = [".pdf", ".doc", ".docx"]
    ext = os.path.splitext(value.name)[1].lower()

    # ✔ check file type
    if ext not in allowed_extensions:
        raise ValidationError(
            "Only PDF, DOC and DOCX files are allowed."
        )

    # ✔ check file size (5MB limit)
    max_size = 5 * 1024 * 1024  # 5MB
    if value.size > max_size:
        raise ValidationError("File size should be under 5MB.")