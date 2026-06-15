from django.urls import path
from . import views

urlpatterns = [

    path('', views.home),

    path('send/', views.send_notification),

    path('list/', views.notification_list),

    path('read/', views.mark_as_read),

    path('delete/', views.delete_notification),

]