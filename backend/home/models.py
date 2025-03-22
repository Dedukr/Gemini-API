from django.db import models


# Create your models here.
class RequestModel(models.Model):
    image = models.ImageField()
    question = models.CharField(max_length=50)
