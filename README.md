# Platform Management System - MVP

## Quick Start

### Backend
```bash
cd backend
npm run dev
```
Server runs on http://localhost:3000

### Frontend
```bash
cd frontend
npm run dev
```
Frontend runs on http://localhost:5173

## Default Credentials
- Email: admin@example.com
- Password: admin123

## API Endpoints

### Auth
- POST `/api/auth/login` - Login

### Users
- GET `/api/users` - List users (Admin only)
- POST `/api/users` - Create user (Admin only)
- PUT `/api/users/:id` - Update user (Admin only)
- DELETE `/api/users/:id` - Delete user (Admin only)

### Sectors
- GET `/api/sectors` - List sectors
- POST `/api/sectors` - Create sector (Admin only)
- PUT `/api/sectors/:id` - Update sector (Admin only)
- DELETE `/api/sectors/:id` - Delete sector (Admin only)

### Platforms
- GET `/api/platforms` - List platforms (with filters)
- POST `/api/platforms` - Create platform (Admin only)
- PUT `/api/platforms/:id` - Update platform (Admin only)
- DELETE `/api/platforms/:id` - Delete platform (Admin only)

### Admin
- PATCH `/api/admin/users/:id/toggle-admin` - Toggle admin role
- GET `/api/admin/expiring-platforms` - Get expiring platforms

## Database
Using SQLite for MVP (file: `backend/prisma/dev.db`)

To reset database:
```bash
cd backend
rm prisma/dev.db
npx prisma db push
npx ts-node prisma/seed.ts
```
