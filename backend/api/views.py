import json
import os
import uuid
from io import BytesIO

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

        print(f"FILES: {request.FILES}")
        print(f"DATA: {request.data}")

        print(f"Image: {image}")
        print(f"Image Name: {getattr(image, 'name', None)}")
        print(f"Content Type: {getattr(image, 'content_type', None)}")

        if not image or not getattr(image, "name", None):
            return Response({"error": "Invalid image file"}, status=400)

        content_type = image.content_type or "application/octet-stream"

        try:
            file_key = f"{uuid.uuid4()}-{image.name}"
            content_type = image.content_type or "application/octet-stream"
            
            print(f"Uploading to S3: {file_key}, Content Type: {content_type}")
            
            # Upload image to S3
            s3 = boto3.client(
                "s3",
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                region_name=settings.AWS_S3_REGION_NAME,
            )
            
            file_like_object = BytesIO(image.read())
            print(file_like_object)
            
            # Upload the file (no ACL: public-read)
            s3.upload_fileobj(
                Fileobj=file_like_object,
                Bucket=settings.AWS_STORAGE_BUCKET_NAME,
                Key=file_key,
                ExtraArgs={"ContentType": content_type},
            )

        except Exception as e:
            return Response({"error": str(e)}, status=500)

        try:
            print(f"Generating pre-signed URL for: {file_key}")
            # Generate a pre-signed URL
            image_url = s3.generate_presigned_url(
                ClientMethod="get_object",
                Params={"Bucket": settings.AWS_STORAGE_BUCKET_NAME, "Key": file_key},
                ExpiresIn=15,  # URL valid for 15 seconds
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
