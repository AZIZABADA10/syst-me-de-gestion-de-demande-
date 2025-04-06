Système de Gestion des Demandes de Matériel

## Description
Le projet **Système de Gestion des Demandes de Matériel** est un projet de stage réalisé au sein de l'organisation Group Bc skills.
Ce système permet la gestion efficace des demandes de matériel, incluant la gestion des stocks, des utilisateurs, ainsi que des demandes soumises par les employés.

## Fonctionnalités principales
1. **Gestion des demandes** :
   - Affichage des demandes passées.
   - Approvisionnement et suivi des demandes.
   - Validation ou rejet des demandes.

2. **Gestion des stocks** :
   - Visualisation des niveaux de stock.
   - Mise à jour des stocks en temps réel.
   - Alerte pour les stocks faibles.

3. **Gestion des utilisateurs** :
   - Création, modification et suppression des utilisateurs.
   - Attribution de rôles spécifiques (admin, validateur, employé).

4. **Sécurité et configuration** :
   - Authentification des utilisateurs.
   - Notifications et alertes pour les utilisateurs.

## Architecture
- **Backend** : [Laravel](https://laravel.com/) (API) avec MySQL
- **Frontend** : [React.js](https://reactjs.org/) avec Bootstrap
- **Base de données** : MySQL

## Technologies utilisées
- **Laravel** pour le backend (API RESTful).
- **React.js** pour le frontend avec des composants dynamiques.
- **MySQL** pour la gestion de la base de données.
- **Bootstrap** pour une interface moderne et responsive.

## Installation

### Prérequis
- PHP 8.0 ou supérieur
- Composer pour gérer les dépendances PHP
- Node.js et npm (ou yarn) pour la gestion des dépendances frontend
- MySQL

### Backend (Laravel)
1. Clonez le dépôt :
   ```bash
   git clone https://github.com/AZIZABADA10/syst-me-de-gestion-de-demande-.git
   ```
2. Accédez au dossier backend :
   ```bash
   cd syst-me-de-gestion-de-demande-/backend
   ```
3. Installez les dépendances avec Composer :
   ```bash
   composer install
   ```
4. Copiez le fichier `.env.example` en `.env` et configurez vos variables d'environnement (notamment les informations de la base de données).
5. Générez la clé d'application Laravel :
   ```bash
   php artisan key:generate
   ```
6. Exécutez les migrations pour créer les tables de la base de données :
   ```bash
   php artisan migrate
   ```
7. Lancez le serveur local :
   ```bash
   php artisan serve
   ```

### Frontend (React.js)
1. Accédez au dossier frontend :
   ```bash
   cd frontend
   ```
2. Installez les dépendances avec npm (ou yarn) :
   ```bash
   npm install
   ```
3. Lancez le serveur de développement :
   ```bash
   npm start
   ```

## Structure du projet

### Backend
- **app/** : Contient les contrôleurs, modèles et autres composants de l'application.
- **routes/** : Définition des routes API.
- **database/** : Contient les migrations et les usines.

### Frontend
- **src/** : Composants React.
  - **components/** : Composants utilisés dans les dashboards (Admin, Validateur, Employé).
  - **pages/** : Pages des différents dashboards.
  - **App.js** : Point d'entrée de l'application React.

## Contribuer
Les contributions sont les bienvenues ! Si vous souhaitez contribuer à ce projet, veuillez suivre les étapes suivantes :

1. Forkez ce dépôt.
2. Créez une nouvelle branche (`git checkout -b feature/ma-fonctionnalite`).
3. Commitez vos modifications (`git commit -am 'Ajout d'une nouvelle fonctionnalité'`).
4. Poussez votre branche (`git push origin feature/ma-fonctionnalite`).
5. Ouvrez une pull request.

## Auteurs
- Aziz Abada – Développeur principal
- Jajaa Mohemad – Développeur principal

## Licence
Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## Remerciements
Merci à l'organisation Group Bc skills pour l'opportunité de stage et à nos encadrants pour leur soutien.
