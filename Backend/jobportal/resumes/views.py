from django.http import JsonResponse


def home(request):

    return JsonResponse({
        "message": "Resume Module"
    })


def upload_resume(request):

    return JsonResponse({
        "message": "Resume Uploaded Successfully"
    })


def resume_list(request):

    return JsonResponse({
        "message": "Resume List"
    })


def resume_details(request):

    return JsonResponse({
        "message": "Resume Details"
    })


def update_resume(request):

    return JsonResponse({
        "message": "Resume Updated Successfully"
    })


def delete_resume(request):

    return JsonResponse({
        "message": "Resume Deleted Successfully"
    })
# Create your views here.
