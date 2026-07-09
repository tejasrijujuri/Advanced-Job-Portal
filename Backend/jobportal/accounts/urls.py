from django.urls import path

from .views import (
    RegisterView,
    ProfileView,
    RecruiterProfileView,
    send_otp,
    verify_otp,
    reset_password,
)

urlpatterns = [
    # =========================
    # AUTH
    # =========================
    path("register/", RegisterView.as_view(), name="register"),

    # =========================
    # JOBSEEKER PROFILE
    # =========================
    path("profile/", ProfileView.as_view(), name="profile"),

    # =========================
    # RECRUITER PROFILE
    # =========================
    path("recruiter-profile/", RecruiterProfileView.as_view(), name="recruiter-profile"),

    # =========================
    # PASSWORD RESET FLOW
    # =========================
    path("send-otp/", send_otp, name="send_otp"),
    path("verify-otp/", verify_otp, name="verify_otp"),
    path("reset-password/", reset_password, name="reset_password"),
]