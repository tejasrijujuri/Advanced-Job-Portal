from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.core.mail import send_mail
import random

from .models import User, PasswordResetOTP, Profile, RecruiterProfile
from .serializers import (
    RegisterSerializer,
    UserSerializer,
    ProfileSerializer,
    RecruiterProfileSerializer
)


# =========================
# REGISTER
# =========================
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


# =========================
# USER PROFILE (BASIC)
# =========================
class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


# =========================
# JOBSEEKER PROFILE
# =========================
class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        profile, _ = Profile.objects.get_or_create(user=self.request.user)
        return profile


# =========================
# RECRUITER PROFILE (FIXED)
# =========================
class RecruiterProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = RecruiterProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        profile, _ = RecruiterProfile.objects.get_or_create(user=self.request.user)
        return profile


# =========================
# SEND OTP
# =========================
@api_view(["POST"])
@permission_classes([AllowAny])
def send_otp(request):
    email = request.data.get("email")

    if not email:
        return Response({"error": "Email is required"}, status=400)

    user = User.objects.filter(email=email).first()

    if not user:
        return Response({"error": "Email not found"}, status=404)

    otp = str(random.randint(100000, 999999))

    PasswordResetOTP.objects.filter(user=user).delete()
    PasswordResetOTP.objects.create(user=user, otp=otp)

    send_mail(
        subject="OTP for Advanced Job Portal",
        message=f"Your OTP is {otp}. Valid for 5 minutes.",
        from_email="your_email@gmail.com",
        recipient_list=[email],
        fail_silently=False,
    )

    return Response({"message": "OTP sent successfully"})


# =========================
# VERIFY OTP
# =========================
@api_view(["POST"])
@permission_classes([AllowAny])
def verify_otp(request):
    email = request.data.get("email")
    otp = str(request.data.get("otp"))

    if not email or not otp:
        return Response({"error": "Email and OTP required"}, status=400)

    user = User.objects.filter(email=email).first()

    if not user:
        return Response({"error": "User not found"}, status=404)

    otp_obj = PasswordResetOTP.objects.filter(
        user=user,
        otp=otp,
        is_verified=False
    ).first()

    if not otp_obj:
        return Response({"error": "Invalid OTP"}, status=400)

    if otp_obj.is_expired():
        return Response({"error": "OTP expired"}, status=400)

    otp_obj.is_verified = True
    otp_obj.save()

    return Response({"message": "OTP verified"})


# =========================
# RESET PASSWORD
# =========================
@api_view(["POST"])
@permission_classes([AllowAny])
def reset_password(request):
    email = request.data.get("email")
    password = request.data.get("password")

    if not email or not password:
        return Response({"error": "Email and password required"}, status=400)

    user = User.objects.filter(email=email).first()

    if not user:
        return Response({"error": "User not found"}, status=404)

    otp_obj = PasswordResetOTP.objects.filter(
        user=user,
        is_verified=True
    ).first()

    if not otp_obj:
        return Response({"error": "OTP not verified"}, status=400)

    if otp_obj.is_expired():
        return Response({"error": "OTP expired"}, status=400)

    user.set_password(password)
    user.save()

    PasswordResetOTP.objects.filter(user=user).delete()

    return Response({"message": "Password reset successful"})