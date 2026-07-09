import django_filters
from .models import Resume


class ResumeFilter(django_filters.FilterSet):
    skills = django_filters.CharFilter(lookup_expr="icontains")
    experience = django_filters.CharFilter()

    class Meta:
        model = Resume
        fields = ["skills", "experience"]