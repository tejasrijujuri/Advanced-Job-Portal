from django.db import models


class Job(models.Model):

    JOB_TYPES = (
        ('Full-Time', 'Full-Time'),
        ('Part-Time', 'Part-Time'),
        ('Internship', 'Internship'),
        ('Remote', 'Remote'),
    )

    STATUS = (
        ('Open', 'Open'),
        ('Closed', 'Closed'),
    )

    company_name = models.CharField(max_length=200)
    job_title = models.CharField(max_length=200)
    job_description = models.TextField()

    location = models.CharField(max_length=100)

    salary = models.DecimalField(max_digits=10, decimal_places=2)

    experience = models.IntegerField()

    skills = models.TextField()

    job_type = models.CharField(
        max_length=20,
        choices=JOB_TYPES
    )

    vacancies = models.IntegerField()

    last_date = models.DateField()

    status = models.CharField(
        max_length=20,
        choices=STATUS,
        default='Open'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.job_title
# Create your models here.
