# Certs - README

Ce dossier contient les fichiers nécessaires à la génération et à l'installation de certificats SSL/TLS. Assurez-vous de disposer des fichiers requis avant de continuer.

## Prérequis

Avant de pouvoir utiliser ce dossier, vous devrez fournir les trois fichiers suivants :

1. **cert.crt**
    - Fichier de certificat SSL/TLS.
    - Il contient la clé publique utilisée pour établir une connexion sécurisée.
2. **csr.pem**
    - Fichier de demande de signature de certificat (CSR, Certificate Signing Request).
    - Utilisé pour demander un certificat à une autorité de certification.
3. **key.pem**
    - Fichier de clé privée.
    - Utilisé pour signer et déchiffrer les informations sécurisées dans la communication.

## Étapes pour générer les fichiers :

#### 1️⃣ **Générer une clé privée (`key.pem`)**

Exécute cette commande :

```bash
openssl genpkey -algorithm RSA -out key.pem
```

#### 2️⃣ **Créer une demande de signature de certificat (`csr.pem`)**

```bash
openssl req -new -key key.pem -out csr.pem
```

#### 3️⃣ **Auto-signer un certificat (`cert.crt`)** _(pour test/local uniquement)_

Si tu n’as pas d’autorité de certification (CA), tu peux générer un certificat auto-signé :

```bash
openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out cert.crt
```
