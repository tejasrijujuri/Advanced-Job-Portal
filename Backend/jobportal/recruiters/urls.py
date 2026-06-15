from django.urls import path
from . import views

urlpatterns = [

    path('', views.home),

    path('register/', views.register_recruiter),

    path('profile/', views.recruiter_profile),

    path('update/', views.update_profile),

    path('jobs/', views.recruiter_jobs),

]