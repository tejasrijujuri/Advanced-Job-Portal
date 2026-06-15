from django.http import JsonResponse


def home(request):
    return JsonResponse({
        "message": "Recruiters Home API"
    })


def register_recruiter(request):
    return JsonResponse({
        "message": "Recruiter Registration API"
    })


def recruiter_profile(request):
    return JsonResponse({
        "message": "Recruiter Profile API"
    })


def update_profile(request):
    return JsonResponse({
        "message": "Recruiter Profile Updated"
    })


def recruiter_jobs(request):
    return JsonResponse({
        "message": "Recruiter Jobs API"
    })