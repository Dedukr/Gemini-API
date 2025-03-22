from django.shortcuts import render

from .forms import RequestForm


# Create your views here.
def home_view(request):
    context = {"form": RequestForm}
    return render(request, "index.html", context)
