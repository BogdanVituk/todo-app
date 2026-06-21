# Реалізація спільного доступу до списку задач (Підхід №2)

## ✅ Що реалізовано

### Backend (NestJS + Prisma + Nodemailer)
- ✅ Нова модель БД `SharedList` з полями:
  - `token` - унікальний UUID токен
  - `recipientEmail` - email отримувача
  - `tasksData` - JSON з даними задач
  - `createdAt` - час створення
  - `expiresAt` - час сплину посилання (7 днів)

- ✅ Mail сервіс з використанням Nodemailer
- ✅ Два нові endpoints:
  - `POST /tasks/share` - генерує посилання і відправляє email
  - `GET /tasks/shared/:token` - повертає задачи для поділеного списку (з перевіркою на сплину)

### Frontend (React + React Router)
- ✅ Оновлена функція `shareTodos()` - тепер тільки відправляє email
- ✅ Нова функція `getSharedTodos(token)` - завантажує поділений список
- ✅ Компонент `SharedListPage` - режим "тільки для читання"
- ✅ SPA роутинг з підтримкою `/shared/:token`
- ✅ Read-only режим для TodoItem та TodosList

## 🚀 Налаштування та запуск

### Backend

1. **Налаштування email (Nodemailer)**
   
   #### 🧪 Для тестування - Ethereal Email (рекомендовано)
   
   Це безплатний тестовий email сервіс від Nodemailer, який НЕ вимагає справжнього email акаунту.
   
   Просто встановіть `MAIL_HOST=ethereal` в `.env`:
   ```bash
   MAIL_HOST=ethereal
   MAIL_PORT=587
   MAIL_FROM=noreply@todo-app.com
   ```
   
   Коли ви відправляєте email:
   - ✅ Email не відправляється деінде
   - ✅ Вам буде виведено **Preview URL** в консолі
   - ✅ Клікніть по URL щоб переглянути email в браузері
   
   **Приклад виводу:**
   ```
   ✅ Ethereal Email configured for testing
   📧 Test credentials: abc123@ethereal.email
   📧 Preview URL will be shown after sending email
   ...
   📧 Preview URL: https://ethereal.email/message/abc123def456
   ```
   
   #### 📧 Для справжнього email (Gmail, SendGrid, тощо)
   
   ```bash
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=587
   MAIL_SECURE=false
   MAIL_USER=your-email@gmail.com
   MAIL_PASS=your-app-password
   MAIL_FROM=your-email@gmail.com
   ```
   
   Копіюйте `.env.example` в `.env`:
   ```bash
   cp .env.example .env
   ```

2. **Запуск backend**
   ```bash
   cd back
   npm run start:dev
   ```
   Backend буде доступний на `http://localhost:3000`

### Frontend

1. **Запуск frontend**
   ```bash
   cd front
   npm run dev
   ```
   Frontend буде доступний на `http://localhost:5173`

## 📧 Email посилання

Коли користувач натискає кнопку "📧 Share List" і вводить email:
1. Backend генерує унікальний UUID токен
2. Збереження задач в JSON форматі в БД
3. Отримувач отримує email з посиланням типу: `http://localhost:5173/shared/abc-123-def-456`
4. Отримувач переходить по посиланню і бачить список в режимі "тільки для читання"

## 📝 Тестування

### Тестовий flow з Ethereal Email:
1. Переконайтесь що `MAIL_HOST=ethereal` в `.env`
2. Запустіть backend: `npm run start:dev`
3. Відкрийте фронтенд на http://localhost:5174
4. Створіть кілька задач в основному списку
5. Натисніть "📧 Share List"
6. Введіть будь-який email (не потрібно справжній)
7. Натисніть "Поділитись"
8. **В консолі backend ви побачите:**
   ```
   📧 Preview URL: https://ethereal.email/message/abc123...
   ```
9. **Скопіюйте URL та вставте його в браузер** - ви побачите відправлений email з посиланням на поділений список

### Тестовий flow з настоящим email:
1. Оновіть `.env` з справжніми email даними
2. Натисніть "📧 Share List"
3. Введіть справжній email отримувача
4. Натисніть "Поділитись"
5. Отримувач отримає email з посиланням

## 📝 Як це працює

### Ethereal Email workflow:
```
Frontend → Backend → Nodemailer → Ethereal SMTP
                                    ↓
                          Preview URL in console
                                    ↓
                          Click link → View in browser
```

**Переваги Ethereal:**
- ✅ Без налаштувань
- ✅ Без справжніх email акаунтів
- ✅ Миттєвий preview
- ✅ Ідеально для розробки

## 🔗 Перегляд поділеного списку

1. Коли натиснути "Поділитись", backend генерує унікальне посилання: `/shared/[UUID-TOKEN]`
2. Email містить кнопку з цим посиланням
3. Клік по посиланню → відкривається сторінка з поділеним списком в режимі читання

## 🔐 Примітки безпеки

- Посилання активні протягом 7 днів (налаштовується в `tasks.service.ts`)
- Через 7 днів посилання стає недійсним
- Дані задач зберігаються як JSON (можна розширити для синхронізації в реальному часі)
- Email адреса отримувача не перевіряється (додайте перевірку на продакшні)

## 🛠️ Подальші розширення

- [ ] Синхронізація в реальному часі (WebSocket)
- [ ] Колаборативне редагування
- [ ] Видалення застарілих поділень після сплину
- [ ] Обмеження на кількість поділень
- [ ] Приватні посилання з паролем
