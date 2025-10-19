# Development Dockerfile for hacking-tutorial
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpcap-dev \
    libssl-dev \
    net-tools \
    nmap \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements files
COPY requirements.txt requirements-dev.txt ./

# Install Python dependencies
RUN pip install --upgrade pip && \
    pip install -r requirements-dev.txt

# Copy the rest of the application
COPY . .

# Create a non-root user
RUN useradd -m -u 1000 user
USER user

# Expose ports (if needed for any services)
EXPOSE 8000

# Default command
CMD ["/bin/bash"]