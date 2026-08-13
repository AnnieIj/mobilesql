# Production Deployment Guide

This guide details how to deploy MobileSQL to modern cloud container platforms.

---

## 1. Environment Variables Checklist

Ensure these variables are defined in your deployment target:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `NODE_ENV` | Runtime environment | `production` |
| `PORT` | Container HTTP binding port | `3000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/mobilesql` |
| `JWT_SECRET` | 256-bit cryptographically secure string | `openssl rand -hex 32` |
| `GEMINI_API_KEY` | Google Gemini API Key | `AIzaSy...` |
| `SENTRY_DSN` | (Optional) Error monitoring DSN | `https://...@sentry.io/...` |

---

## 2. Google Cloud Run Deployment

```bash
# 1. Build and submit container image
gcloud builds submit --tag gcr.io/[PROJECT_ID]/mobilesql:latest

# 2. Deploy to Cloud Run
gcloud run deploy mobilesql \
  --image gcr.io/[PROJECT_ID]/mobilesql:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3000 \
  --memory 1Gi \
  --cpu 1 \
  --set-env-vars="NODE_ENV=production,GEMINI_API_KEY=xxx,DATABASE_URL=xxx"
```

---

## 3. Docker Compose Self-Hosted Deployment

```bash
# Clone the repository
git clone https://github.com/mobilesql/mobilesql.git
cd mobilesql

# Configure production environment
cp .env.example .env

# Launch production stack with NGINX reverse proxy
docker-compose -f docker-compose.prod.yml up -d
```

---

## 4. Kubernetes (K8s) Deployment Manifest

A standard Kubernetes deployment manifest with Horizontal Pod Autoscaling (HPA) and readiness/liveness probes targetting `/api/health`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mobilesql-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: mobilesql
  template:
    metadata:
      labels:
        app: mobilesql
    spec:
      containers:
      - name: mobilesql
        image: mobilesql/app:latest
        ports:
        - containerPort: 3000
        livenessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 15
          periodSeconds: 20
        resources:
          limits:
            cpu: "1000m"
            memory: "1024Mi"
          requests:
            cpu: "250m"
            memory: "256Mi"
```
