FROM python:3.9-slim

WORKDIR /app

# Cài đặt chứng chỉ CA
RUN apt-get update && apt-get install -y \
    ca-certificates \
    && update-ca-certificates \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Cập nhật pip
RUN pip install --no-cache-dir --upgrade pip

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Định nghĩa biến môi trường PORT mặc định
ENV PORT=8000
EXPOSE 8000

# Chạy Gunicorn với cổng động
CMD exec gunicorn --bind 0.0.0.0:$PORT app:app