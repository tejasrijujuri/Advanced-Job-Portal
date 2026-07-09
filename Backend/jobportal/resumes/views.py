from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from django.shortcuts import get_object_or_404

from .models import Resume
from .serializers import ResumeSerializer

from jobs.models import Job
from .utils.scoring import calculate_score


class ResumeViewSet(viewsets.ModelViewSet):
    serializer_class = ResumeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Resume.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    # 💥 Resume Ranking API (JOB-WISE)
    @action(detail=False, methods=["get"], url_path="rank/(?P<job_id>[^/.]+)")
    def rank_resumes(self, request, job_id=None):

        job = get_object_or_404(Job, id=job_id)

        job_skills = [s.strip().lower() for s in job.skills.split(",") if s.strip()]

        resumes = Resume.objects.all()

        results = []

        for resume in resumes:
            resume_skills = [
                s.strip().lower() for s in resume.skills.split(",") if s.strip()
            ]

            score = calculate_score(job_skills, resume_skills)

            results.append({
                "resume_id": resume.id,
                "candidate": resume.user.username,
                "skills": resume.skills,
                "score": score
            })

        results = sorted(results, key=lambda x: x["score"], reverse=True)

        return Response({
            "job": job.title,
            "results": results
        })