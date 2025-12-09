# Налаштування Google OAuth

## Крок 1: Створення Google OAuth Credentials

1. Перейдіть на [Google Cloud Console](https://console.cloud.google.com/)
2. Створіть новий проєкт або виберіть існуючий
3. Увімкніть **Google+ API**:
   - Перейдіть до "APIs & Services" > "Library"
   - Знайдіть "Google+ API" та натисніть "Enable"

4. Створіть OAuth 2.0 Credentials:
   - Перейдіть до "APIs & Services" > "Credentials"
   - Натисніть "Create Credentials" > "OAuth client ID"
   - Якщо потрібно, налаштуйте OAuth consent screen:
     - User Type: External
     - App name: Social Map
     - User support email: ваш email
     - Developer contact: ваш email
   - Application type: **Web application**
   - Name: Social Map Backend
   - Authorized JavaScript origins:
     - `http://localhost:5000`
   - Authorized redirect URIs:
     - `http://localhost:5000/api/auth/google/callback`

5. Скопіюйте **Client ID** та **Client Secret**

## Крок 2: Налаштування .env файлу

1. Створіть файл `.env` в папці `backend/`:
```bash
cd backend
cp .env.example .env
```

2. Відредагуйте `.env` та додайте ваші Google OAuth credentials:
```
GOOGLE_CLIENT_ID=ваш-client-id
GOOGLE_CLIENT_SECRET=ваш-client-secret
JWT_SECRET=будь-який-випадковий-рядок
SESSION_SECRET=інший-випадковий-рядок
```

## Крок 3: Перезапустіть сервер

Після налаштування перезапустіть backend сервер.

## Перевірка

1. Відкрийте `http://localhost:5173`
2. Натисніть "Увійти через Google"
3. Виберіть ваш Google акаунт
4. Після успішного входу ви зможете додавати місця на карту



