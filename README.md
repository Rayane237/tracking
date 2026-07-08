# Dubai Global Express Tracking

Application web professionnelle de suivi de commandes de véhicules importés, construite avec React.js, Vite, Tailwind CSS, Node.js, Express.js et MongoDB Atlas.

## Fonctionnalités

- Recherche publique par code de suivi unique.
- Page de suivi client avec carte interactive, statut, cargaison, véhicule, ports et timeline.
- Interface administrateur sécurisée avec JWT.
- Création, modification, suppression et gestion des commandes.
- Génération automatique de codes de suivi.
- Mise à jour de la position du véhicule et des escales.
- Upload de photos de véhicules avec Multer.
- Tableau de bord avec statistiques clés.
- Design premium responsive, palette rouge, noir, blanc et gris.
- Architecture claire, composants réutilisables et API structurée MVC.

## Structure

```txt
dubai-global-express-tracking/
  client/   Interface React Vite
  server/   API Express MongoDB
  docs/     Image de référence et notes
```

## Installation locale

```bash
npm run install:all
```

Crée ensuite les fichiers d'environnement :

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Renseigne `MONGODB_URI` avec ton URL MongoDB Atlas dans `server/.env`.

## Lancer le projet

Terminal API :

```bash
npm run server
```

Terminal client :

```bash
npm run client
```

## Créer un administrateur et une commande exemple

```bash
npm run seed
```

Identifiants de démonstration :

```txt
Email: admin@dubaiglobalexpress.com
Mot de passe: Admin@2026
Code de suivi exemple: DGE-2026-YARIS
```

## Logo

Le logo est centralisé ici :

```txt
client/public/logo-dubai-global-express.png
```

Pour utiliser le logo officiel, remplace simplement ce fichier par ton PNG en gardant le même nom.

## Déploiement Render

1. Crée une base MongoDB Atlas.
2. Déploie `server` comme Web Service Render.
3. Ajoute les variables `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`.
4. Déploie `client` comme Static Site Render.
5. Ajoute `VITE_API_URL` avec l'URL publique de l'API Render.

