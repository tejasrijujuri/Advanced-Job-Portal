from django.urls import path
from . import views

urlpatterns = [

    path('', views.home, name='application_home'),

    path('apply/<int:job_id>/', views.apply_job, name='apply_job'),

    path('list/', views.application_list, name='application_list'),

    path('detail/<int:pk>/', views.application_detail, name='application_detail'),

    path('update/<int:pk>/', views.update_application, name='update_application'),

    path('delete/<int:pk>/', views.delete_application, name='delete_application'),

    path('dashboard/', views.applicant_dashboard, name='applicant_dashboard'),

]