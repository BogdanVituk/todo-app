# 📝 Todo List Backend API

Повнофункціональний backend для управління списком задач, побудований на **NestJS** з **Prisma ORM** та **JWT аутентифікацією**.

## 🎯 Про проект

Цей проект надає REST API для:
- 👤 Реєстрації та аутентифікації користувачів
- ✅ Управління особистими задачами
- 📤 Поділення списків задач через email
- 🔐 JWT токен-базованої безпеки

---

## 🔧 Технічний стек

| Компонент | Інструмент | Версія |
|-----------|-----------|--------|
| **Framework** | NestJS | ^10.0.0 |
| **ORM** | Prisma | ^7.8.0 |
| **Database** | MySQL | - |
| **Auth** | JWT + Passport | ^11.0.0 + ^4.0.1 |
| **Validation** | class-validator | ^0.15.1 |
| **Email** | Nodemailer | ^9.0.1 |
| **Testing** | Jest | ^29.5.0 |

---

## 📦 Встановлення

### 1. Клонування репозиторію
```bash
git clone <repo-url>
cd back
npm install
```

### 2. Налаштування базу даних

```bash
# Генерування Prisma Client
npm run prisma:generate

# Запуск міграцій
npx prisma migrate deploy
```

### 3. Створення `.env` файлу

Скопіюйте `.env.example` та налаштуйте змінні:

```bash
cp .env.example .env
```

**Обов'язкові змінні:**
```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/todo_list"

# JWT
JWT_SECRET="your-super-secret-key-min-32-chars"
JWT_EXPIRY="1d"

# Email (для тестування використовуйте Ethereal)
MAIL_HOST="smtp.ethereal.email"
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER="your-ethereal-email@ethereal.email"
MAIL_PASS="your-ethereal-password"
MAIL_FROM="noreply@todo-app.com"

# Frontend
FRONTEND_URL="http://localhost:5173"
PORT=3000
```

---

## 🚀 Запуск

```bash
# Development з watch mode
npm run start:dev

# Production
npm run build
npm run start:prod

# Debug mode
npm run start:debug
```

Сервер запуститься на `http://localhost:3000`

---

## 🧪 Тестування

```bash
# Unit тести
npm test

# Watch mode
npm test:watch

# Coverage
npm test:cov

# E2E тести
npm run test:e2e
```

---

## 📡 API Endpoints

### 🔐 Аутентифікація

#### Реєстрація
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Відповідь (201):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Вхід
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Відповідь (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

### ✅ Задачі (потребує JWT)

Усі запити повинні мати header:
```
Authorization: Bearer <accessToken>
```

#### Отримати всі задачі
```http
GET /tasks?page=1&limit=10
Authorization: Bearer <token>
```

**Відповідь (200):**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Купити молоко",
      "description": "Покупка молока в магазині",
      "completed": false,
      "userId": 1,
      "createdAt": "2026-06-21T10:30:00Z",
      "updatedAt": "2026-06-21T10:30:00Z"
    }
  ],
  "meta": {
    "totalItems": 5,
    "itemCount": 1,
    "itemsPerPage": 10,
    "totalPages": 1,
    "currentPage": 1
  }
}
```

#### Створити задачу
```http
POST /tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Написати код",
  "description": "Завершити функцію авторизації"
}
```

**Відповідь (201):**
```json
{
  "id": 2,
  "title": "Написати код",
  "description": "Завершити функцію авторизації",
  "completed": false,
  "userId": 1,
  "createdAt": "2026-06-21T11:00:00Z",
  "updatedAt": "2026-06-21T11:00:00Z"
}
```

#### Оновити статус задачи
```http
PATCH /tasks/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "completed": true
}
```

#### Видалити задачу
```http
DELETE /tasks/:id
Authorization: Bearer <token>
```

**Відповідь (200):**
```json
{
  "id": 1,
  "title": "Купити молоко",
  "description": "Покупка молока в магазині",
  "completed": false,
  "userId": 1,
  "createdAt": "2026-06-21T10:30:00Z",
  "updatedAt": "2026-06-21T10:30:00Z"
}
```

#### Поділити список задач
```http
POST /tasks/share
Authorization: Bearer <token>
Content-Type: application/json

{
  "email": "friend@example.com"
}
```

**Відповідь (201):**
```json
{
  "id": 1,
  "token": "550e8400-e29b-41d4-a716-446655440000",
  "recipientEmail": "friend@example.com",
  "tasksData": "[...]",
  "createdAt": "2026-06-21T11:00:00Z",
  "expiresAt": "2026-06-28T11:00:00Z"
}
```

#### Отримати поділену з вами задачу
```http
GET /tasks/shared/:token
```

**Відповідь (200):**
```json
[
  {
    "id": 1,
    "title": "Купити молоко",
    "description": "Покупка молока в магазині",
    "completed": false,
    "userId": 1,
    "createdAt": "2026-06-21T10:30:00Z",
    "updatedAt": "2026-06-21T10:30:00Z"
  }
]
```
