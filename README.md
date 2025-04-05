# Laravel + React.js (Vite) Starter

Ce projet est une application Laravel avec React.js en frontend, utilisant **Vite** pour un développement rapide.

## 🛠️ Installation et Configuration

### 1️⃣ Cloner le projet
```sh
git clone https://github.com/ton-utilisateur/ton-projet.git
cd ton-projet
```

### 2️⃣ Installer les dépendances Laravel
```sh
composer install
```

### 3️⃣ Configurer l'environnement Laravel
Copie le fichier `.env.example` en `.env` :
```sh
cp .env.example .env
```
Générer la clé de l'application :
```sh
php artisan key:generate
```
Configurer la base de données dans `.env` :
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nom_de_ta_bdd
DB_USERNAME=utilisateur
DB_PASSWORD=mot_de_passe
```
Puis migrer les tables :
```sh
php artisan migrate
```

### 4️⃣ Installer les dépendances React.js
```sh
cd react
npm install
```

## 🚀 Démarrer l'application

### Lancer le backend Laravel
```sh
php artisan serve
```

### Lancer le frontend React avec Vite
```sh
cd react
npm run dev
```

## 🔧 Configuration CORS
Si tu utilises Laravel Sanctum pour l'authentification, active CORS :
```sh
composer require fruitcake/laravel-cors
```
Ajoute ceci dans `config/cors.php` :
```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
```

## 📂 Structure du projet
```
📦 projet
├── 📂 backend (Laravel)
│   ├── app/
│   ├── bootstrap/
│   ├── config/
│   ├── database/
│   ├── routes/
│   ├── .env
│   └── artisan
│
├── 📂 react (Frontend Vite + React)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   ├── vite.config.js
│   ├── package.json
│   └── .env
```

## 📌 Notes
- Laravel est utilisé pour le backend en tant qu'API.
- React.js avec Vite permet un développement rapide et fluide.
- Laravel Sanctum est recommandé pour l'authentification.
- N'oublie pas d'activer CORS pour éviter les erreurs de requêtes cross-origin.

---

### 🔗 Liens utiles
- [Laravel Documentation](https://laravel.com/docs)
- [Vite Documentation](https://vitejs.dev/)
- [React.js Documentation](https://react.dev/)

Bon développement ! 🚀


