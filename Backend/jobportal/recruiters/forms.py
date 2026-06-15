from django import forms
from .models import Recruiter


class RecruiterForm(forms.ModelForm):

    class Meta:
        model = Recruiter
        fields = "__all__"