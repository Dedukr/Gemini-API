import json
import os

import boto3
import requests
from django.conf import settings
from django.shortcuts import render
from google import genai
from google.genai import types
from rest_framework.response import Response
from rest_framework.views import APIView


# Create your views here.
class AskGeminiView(APIView):

    def post(self, request):
        image = request.FILES.get("image")
        question = request.data.get("question")

        if not question or not image:
            return Response({"error": "Missing question or image"}, status=400)

        try:

            # Upload image to S3
            s3 = boto3.client(
                "s3",
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                region_name=settings.AWS_S3_REGION_NAME,
            )

            file_key = image.name

            # Upload the file (no ACL: public-read)
            s3.upload_fileobj(
                Fileobj=image,
                Bucket=settings.AWS_STORAGE_BUCKET_NAME,
                Key=file_key,
                ExtraArgs={"ContentType": image.content_type},
            )

        except Exception as e:
            return Response({"error": str(e)}, status=500)

        try:
            # Generate a pre-signed URL
            image_url = s3.generate_presigned_url(
                ClientMethod="get_object",
                Params={"Bucket": settings.AWS_STORAGE_BUCKET_NAME, "Key": file_key},
                ExpiresIn=60,  # URL valid for 1 minutes
            )
            image_parsed = requests.get(image_url)

            api_key = settings.OPENAI_API_KEY
            client = genai.Client(api_key=api_key)
            response = client.models.generate_content(
                model="gemini-2.0-flash",
                contents=[
                    question,
                    types.Part.from_bytes(
                        data=image_parsed.content, mime_type=image.content_type
                    ),
                ],
            )
            return Response({"answer": response.text})
        except Exception as e:
            return Response({"error": str(e)}, status=500)
