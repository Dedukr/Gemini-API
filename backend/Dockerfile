# Use the official Python image as a base image
FROM python:3.9-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory in the container
WORKDIR /

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy the Django application code to the container
COPY . /app/

# Expose the port the app runs on
EXPOSE 8000

# Command to run the application

# CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

CMD ["gunicorn", "myproject.wsgi:application", "--bind", "0.0.0.0:8000"]