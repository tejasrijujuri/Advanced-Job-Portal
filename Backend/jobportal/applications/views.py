from django.http import JsonResponse


def home(request):
    return JsonResponse({
        "message": "Applications Module"
    })


def apply_job(request):
    return JsonResponse({
        "message": "Apply Job API"
    })


def application_list(request):
    return JsonResponse({
        "message": "Application List"
    })


def application_status(request):
    return JsonResponse({
        "message": "Application Status"
    })
# Create your views here.
