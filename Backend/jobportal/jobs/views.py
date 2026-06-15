from django.http import JsonResponse


def home(request):
    return JsonResponse({
        "message": "Jobs Home API"
    })


def job_list(request):
    return JsonResponse({
        "message": "All Jobs"
    })


def job_detail(request, id):
    return JsonResponse({
        "message": f"Job Details {id}"
    })


def create_job(request):
    return JsonResponse({
        "message": "Job Created Successfully"
    })


def update_job(request, id):
    return JsonResponse({
        "message": f"Job {id} Updated"
    })


def delete_job(request, id):
    return JsonResponse({
        "message": f"Job {id} Deleted"
    })
# Create your views here.
