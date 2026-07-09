from django.urls import path
from .views import recruiter_analytics

urlpatterns = [
    path("analytics/", recruiter_analytics),
]