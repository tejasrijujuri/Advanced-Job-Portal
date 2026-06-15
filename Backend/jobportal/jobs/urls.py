from django.urls import path
from . import views

urlpatterns = [
    path('', views.home),

    path('list/', views.job_list),

    path('<int:id>/', views.job_detail),

    path('create/', views.create_job),

    path('update/<int:id>/', views.update_job),

    path('delete/<int:id>/', views.delete_job),
]