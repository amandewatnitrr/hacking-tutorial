FROM python:3.11-slim

WORKDIR /app

# System deps 
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
 && rm -rf /var/lib/apt/lists/*

COPY ../requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

COPY ../app /app/app
COPY ../exercises /app/exercises
COPY ../tracker /app/tracker
COPY ../trivia /app/trivia

ENV FLASK_APP=app/run.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=8000
EXPOSE 8000

CMD ["python", "app/run.py"]
