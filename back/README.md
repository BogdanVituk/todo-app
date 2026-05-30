# Todo Backend API

Побудовано на NestJS з використанням Prisma ORM для забезпечення надійності та швидкості розробки.

## 🔧 Технічний стек
- **Framework:** NestJS
- **ORM:** Prisma
- **Database:** PostgreSQL/SQLite
- **Validation:** ValidationPipe, DTO

## 📡 API Endpoints

| Метод  | Шлях | Опис |
| :--- | :--- | :--- |
| `GET` | `/tasks` | Отримати всі завдання |
| `POST` | `/tasks` | Створити нове завдання |
| `PATCH` | `/tasks/:id/status` | Переключити статус виконання |
| `DELETE` | `/tasks/:id` | Видалити завдання за ID |

## 💡 Особливості реалізації
- **Global Pipes:** Всі вхідні дані автоматично перевіряються через `ValidationPipe`.
- **CORS:** Налаштована політика для безпечної взаємодії з фронтендом.
- **Type Safety:** Типи автоматично генеруються Prisma на основі схеми БД.

### 🔑 Налаштування змінних оточення

Для коректної роботи проєкту необхідно створити `.env` файли:

**Backend (`/backend/.env`):**
`DATABASE_URL="mysql://user:password@localhost:5432/todo_db"`