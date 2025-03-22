from django import forms

from .models import RequestModel


class RequestForm(forms.ModelForm):
    class Meta:
        model = RequestModel
        fields = ["image", "question"]
