from django.urls import path
from . import views

urlpatterns = [

    path('', views.home),

    path('upload/', views.upload_resume),

    path('list/', views.resume_list),

    path('details/', views.resume_details),

    path('update/', views.update_resume),

    path('delete/', views.delete_resume),

]