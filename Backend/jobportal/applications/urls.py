from django.urls import path
from . import views

urlpatterns = [

    path('', views.home),

    path('apply/', views.apply_job),

    path('list/', views.application_list),

    path('status/', views.application_status),

]