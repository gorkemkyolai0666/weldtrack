# WeldTrack — Deployment Dokümanı

## Demo Hesap
- **E-posta:** demo@kaynakatolyesi.com.tr
- **Şifre:** demo123456
- **Rol:** ADMIN

## İkinci Hesap
- **E-posta:** operator@kaynakatolyesi.com.tr
- **Şifre:** demo123456
- **Rol:** OPERATOR

## Altyapı

### Backend (Railway)
- **Servis:** weldtrack-backend
- **Veritabanı:** PostgreSQL 16
- **Port:** 8080 (Railway internal)
- **URL:** https://weldtrack-backend-production.up.railway.app/api

### Frontend (Vercel)
- **Framework:** Next.js
- **Root Directory:** frontend
- **URL:** https://weldtrack.vercel.app

### Bulut Canlı Önizleme Linki
- **Google IDX:** https://idx.google.com/import?url=https://github.com/gorkemkyolai0666/weldtrack

## Ortam Değişkenleri

### Backend
| Değişken | Açıklama |
|----------|----------|
| DATABASE_URL | PostgreSQL bağlantı dizesi |
| JWT_SECRET | JWT token imzalama anahtarı |
| FRONTEND_URL | CORS için frontend URL |
| PORT | Sunucu portu |

### Frontend
| Değişken | Açıklama |
|----------|----------|
| NEXT_PUBLIC_API_URL | Backend API URL |

## CI/CD Pipeline
1. Pull Request veya main push → CI tetiklenir
2. Backend: PostgreSQL servis başlatılır → Bağımlılıklar yüklenir → Migration → Seed → Build → Test
3. Frontend: Bağımlılıklar yüklenir → Build
4. Main push'ta: Provision job Railway + Vercel deploy eder

## Lokal Geliştirme
```bash
# Backend
cd backend
cp .env.example .env
npm install --legacy-peer-deps
npx prisma migrate dev
npx prisma db seed
npm run start:dev

# Frontend
cd frontend
cp .env.example .env
npm install
npm run dev
```
