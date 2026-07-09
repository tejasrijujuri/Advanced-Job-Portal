from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from jobs.analytics_views import recruiter_stats

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from jobportal.views import send_job_alert


urlpatterns = [
    path("admin/", admin.site.urls),

    path("api/token/", TokenObtainPairView.as_view()),
    path("api/token/refresh/", TokenRefreshView.as_view()),

    path("api/accounts/", include("accounts.urls")),
    path("api/jobs/", include("jobs.urls")),
    path("api/applications/", include("applications.urls")),
    path("api/interviews/", include("interviews.urls")),
    path("api/notifications/", include("notifications.urls")),

    path("api/analytics/", recruiter_stats),

    path("api/resumes/", include("resumes.urls")),
    path("api/saved-jobs/", include("saved_jobs.urls")),

    path("api/admin/", include("admin_dashboard.urls")),

    path("job-alert/", send_job_alert),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)