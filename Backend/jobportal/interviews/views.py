from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse
from .models import Application
from jobs.models import Job
from accounts.models import User


# Home Page
def home(request):
    applications = Application.objects.all()
    return render(request, "applications/home.html", {"applications": applications})


# Apply Job
def apply_job(request, job_id):
    if request.method == "POST":
        user_id = request.POST.get("user_id")

        user = User.objects.get(id=user_id)
        job = Job.objects.get(id=job_id)

        Application.objects.create(
            applicant=user,
            job=job,
            status="Pending"
        )

        return redirect("application_list")

    return render(request, "applications/apply.html")


# Application List
def application_list(request):
    applications = Application.objects.all()

    return render(
        request,
        "applications/application_list.html",
        {"applications": applications}
    )


# Application Details
def application_detail(request, pk):

    application = get_object_or_404(Application, id=pk)

    return render(
        request,
        "applications/application_detail.html",
        {"application": application}
    )


# Update Application Status
def update_application(request, pk):

    application = get_object_or_404(Application, id=pk)

    if request.method == "POST":

        application.status = request.POST.get("status")

        application.save()

        return redirect("application_list")

    return render(
        request,
        "applications/update_application.html",
        {"application": application}
    )


# Delete Application
def delete_application(request, pk):

    application = get_object_or_404(Application, id=pk)

    if request.method == "POST":
        application.delete()
        return redirect("application_list")

    return render(
        request,
        "applications/delete_application.html",
        {"application": application}
    )


# Applicant Dashboard
def applicant_dashboard(request):

    applications = Application.objects.filter(status="Pending")

    return render(
        request,
        "applications/dashboard.html",
        {"applications": applications}
    )
# Create your views here.
