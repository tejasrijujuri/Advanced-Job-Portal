from django.contrib import admin
from .models import Recruiter


@admin.register(Recruiter)
class RecruiterAdmin(admin.ModelAdmin):
    list_display = (
        'company_name',
        'company_email',
        'company_phone',
        'created_at',
    )

    search_fields = (
        'company_name',
        'company_email',
    )

    list_filter = (
        'created_at',
    )
# Register your models here.
