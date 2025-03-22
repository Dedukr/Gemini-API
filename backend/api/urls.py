from django.urls import path

from .views import AskGeminiView

urlpatterns = [
    path("ask/", AskGeminiView.as_view(), name="ask"),
]
