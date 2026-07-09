from resumes.models import Resume
from rest_framework import serializers
from .models import User, Profile, RecruiterProfile


# =========================
# REGISTER SERIALIZER
# =========================
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ["id", "username", "email", "password", "role", "phone"]

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            role=validated_data["role"],
            phone=validated_data.get("phone", "")
        )


# =========================
# USER SERIALIZER
# =========================
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "role", "phone"]


# =========================
# JOBSEEKER PROFILE SERIALIZER
# =========================
class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    email = serializers.CharField(source="user.email", read_only=True)
    role = serializers.CharField(source="user.role", read_only=True)

    class Meta:
        model = Profile
        fields = [
            "id",
            "username",
            "email",
            "role",
            "full_name",
            "mobile",
            "photo",
            "resume",
            "skills",
            "projects",
            "experience",
            "highest_education",
            "percentage",
            "certificates",
            "created_at",
        ]

    def update(self, instance, validated_data):
        # Extract uploaded resume
        uploaded_resume = validated_data.pop("resume", None)

        # Update Profile fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        # Save resume in Profile (existing behavior)
        if uploaded_resume:
            instance.resume = uploaded_resume

        instance.save()

        # Also create/update Resume model
        if uploaded_resume:
            resume_obj, created = Resume.objects.get_or_create(
                user=instance.user
            )

            resume_obj.resume_file = uploaded_resume
            resume_obj.skills = instance.skills
            resume_obj.education = instance.highest_education
            resume_obj.save()

        return instance
# =========================
# RECRUITER PROFILE SERIALIZER
# =========================
class RecruiterProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    email = serializers.CharField(source="user.email", read_only=True)
    role = serializers.CharField(source="user.role", read_only=True)

    class Meta:
        model = RecruiterProfile
        fields = [
            "id",
            "username",
            "email",
            "role",
            "company_name",
            "designation",
            "website",
            "industry",
            "company_size",
            "address",
            "description",
            "logo",
            "created_at",
            "updated_at",
        ]