# Secured Webshop

Ce repository fait partie du projet Secure Webshop pour le cours 183 - Sécurité des applications.  
Il combine une application Node.js avec une base de données MySQL et un container phpMyAdmin pour la gestion de base de données.

## Prérequis

-   Docker & Docker Compose installés sur votre machine.
-   Certificats SSL/TLS requis pour lancer le serveur en HTTPS.  
    Vous devez fournir dans [app/certs](app/certs) les fichiers suivants :
    -   `key.pem` : Clé privée.
    -   `csr.pem` : Demande de signature de certificat (CSR).
    -   `cert.crt` : Certificat SSL/TLS auto-signé ou fourni par une autorité de certification.

Pour générer ces fichiers pour le développement, vous pouvez utiliser les commandes dans [app/certs/README.md](app/certs/README.md).

## Démarrage du projet

1. Créez un fichier `.env` à la racine en vous inspirant de [`.env.example`](.env.example).  
   Exemple :

    ```env
    COMPOSE_PROJECT_NAME=webshop_183
    HASH_METHOD=bcrypt          # bcrypt ou manual
    PORT=443                    # 443 pour https
    JWT_SECRET=onglier
    ```

2. Lancez le stack avec Docker Compose :
    ```sh
    docker-compose up -d
    ```

Le serveur Node.js démarre sur le port [443](https://localhost:443) et utilise HTTPS avec vos certificats.

## Structure du projet

-   **app/**  
    Contient l'application Node.js.

    -   **certs/** : Certificats SSL/TLS et instructions dans README.md.
    -   **controllers/** : Logique des routes applicatives, par exemple UserController.js.
    -   **middleware/** : Gestion des authentifications (JWT) via auth.js.
    -   **public/** : Fichiers statiques & pages (login, signup, profile, styles).  
        Exemples :
        -   login.html
        -   signup.html
        -   profile.ejs
    -   **routes/** : Définition des routes de l’application (app/routes/User.js).
    -   **utils/** : Fonctions utilitaires telles que hashingUtils.js.

-   **db_securewebshop.sql** : Script SQL pour créer la base de données et la table `t_users`.

-   **docker-compose.yml** : Définition du stack Docker incluant MySQL, phpMyAdmin et l’application Node.js.

-   **nodejs.dockerfile** : Fichier de configuration pour construire l’image Docker de l’application Node.js.

## Accès et utilisation

-   **Page de connexion** : [https://localhost/login](https://localhost/login)
-   **Page d'inscription** : [https://localhost/signup](https://localhost/signup)
-   **Profil utilisateur** : Accessible après authentification via [https://localhost/profile](https://localhost/profile)

Les routes de l’API pour la gestion des utilisateurs se trouvent sous `/api/users` (voir app/routes/User.js).

## Aide

-   Pour toute question concernant les certificats SSL/TLS, consultez [app/certs/README.md](app/certs/README.md)..
-   La configuration des variables d’environnement se fait via le fichier .env (voir [`.env.example`](.env.example)).
