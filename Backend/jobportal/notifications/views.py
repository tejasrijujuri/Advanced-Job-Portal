from django.http import JsonResponse


def home(request):

    return JsonResponse({
        "message": "Notification Module"
    })


def send_notification(request):

    return JsonResponse({
        "message": "Notification Sent Successfully"
    })


def notification_list(request):

    return JsonResponse({
        "message": "Notification List"
    })


def mark_as_read(request):

    return JsonResponse({
        "message": "Notification Marked as Read"
    })


def delete_notification(request):

    return JsonResponse({
        "message": "Notification Deleted"
    })
# Create your views here.
