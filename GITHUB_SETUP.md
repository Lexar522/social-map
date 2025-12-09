# Інструкція: Завантаження проєкту на GitHub

## Крок 1: Встановлення Git (якщо не встановлено)

1. Завантажте Git з: https://git-scm.com/download/win
2. Встановіть з налаштуваннями за замовчуванням
3. Перезапустіть термінал

## Крок 2: Налаштування Git (перший раз)

```bash
git config --global user.name "Ваше Ім'я"
git config --global user.email "your.email@example.com"
```

## Крок 3: Створення репозиторію на GitHub

1. Перейдіть на https://github.com
2. Увійдіть у свій акаунт
3. Натисніть "+" (правый верхній кут) → "New repository"
4. Назва: `social-map`
5. Опис: "Social Map - інтерактивна карта з місцями та подіями"
6. Виберіть Public або Private
7. НЕ створюйте README, .gitignore або license (вони вже є)
8. Натисніть "Create repository"

## Крок 4: Ініціалізація Git в проєкті

Відкрийте термінал у папці проєкту (`C:\Users\lexar\Desktop\social-map`) та виконайте:

```bash
# Ініціалізувати git репозиторій
git init

# Додати всі файли
git add .

# Зробити перший commit
git commit -m "Initial commit: Social Map with Google OAuth"

# Додати remote репозиторій (замініть YOUR_USERNAME на ваш GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/social-map.git

# Відправити на GitHub
git branch -M main
git push -u origin main
```

## Крок 5: Якщо виникнуть проблеми з автентифікацією

GitHub більше не підтримує паролі для HTTPS. Варіанти:

### Варіант 1: Personal Access Token
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token (classic)
3. Виберіть scope: `repo`
4. Скопіюйте токен
5. При `git push` використайте токен замість пароля

### Варіант 2: SSH ключ
```bash
# Генерація SSH ключа
ssh-keygen -t ed25519 -C "your.email@example.com"

# Скопіюйте вміст файлу (зазвичай C:\Users\lexar\.ssh\id_ed25519.pub)
# Додайте на GitHub: Settings → SSH and GPG keys → New SSH key

# Змініть remote на SSH
git remote set-url origin git@github.com:YOUR_USERNAME/social-map.git
```

## Важливо!

⚠️ **НЕ комітьте файл `.env`** - він містить секретні дані (Google OAuth credentials, JWT secret).

Файл `.gitignore` вже налаштований, щоб виключити `.env` файли.

## Після завантаження

Додайте README.md з інструкціями для інших розробників (якщо потрібно).

