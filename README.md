# Kitten-IA

Un jeu de combat de chatons inspiré par "LabrUte", où vos chatons s'affrontent dans des combats automatisés basés sur leurs statistiques et compétences.

## Structure du projet

- **Backend**: API NestJS avec Prisma pour la persistence des données
- **Frontend**: Application NextJS pour visualiser et interagir avec le jeu

## Fonctionnalités principales

- Création et gestion de chatons combattants
- Système de combat automatisé avec différentes compétences et attributs
- Visualisation détaillée des combats étape par étape
- Progression et amélioration des chatons au fil du temps

## Prérequis

- Node.js (v16 ou supérieur)
- npm ou yarn
- PostgreSQL

## Installation

### Cloner le dépôt

```bash
git clone https://github.com/villers/kitten-ia.git
cd kitten-ia
```

### Configurer la base de données

1. Créez une base de données PostgreSQL nommée `kitteniadb`
2. Configurez les variables d'environnement dans le fichier `/backend/.env` avec vos informations de connexion à la base de données

### Backend

```bash
cd backend

# Installer les dépendances
npm install

# Générer les clients Prisma
npm run prisma:generate

# Exécuter les migrations pour créer les tables
npm run prisma:migrate

# Peupler la base de données avec des données de test
npm run prisma:seed

# Démarrer le serveur de développement
npm run start:dev
```

Le serveur backend sera disponible à l'adresse: http://localhost:3001

### Frontend

```bash
cd frontend

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

Le serveur frontend sera disponible à l'adresse: http://localhost:3000

## Architecture du projet

### Backend (NestJS)

- **Controllers**: Gèrent les requêtes HTTP et les réponses
  - `auth.controller.ts`: Authentification et enregistrement
  - `users.controller.ts`: Gestion des utilisateurs
  - `kittens.controller.ts`: Gestion des chatons
  - `abilities.controller.ts`: Gestion des capacités
  - `battles.controller.ts`: Gestion des combats

- **Services**: Contiennent la logique métier
  - `auth.service.ts`: Authentication et génération de JWT
  - `users.service.ts`: CRUD pour les utilisateurs
  - `kittens.service.ts`: CRUD pour les chatons
  - `abilities.service.ts`: CRUD pour les capacités
  - `battles.service.ts`: Création et gestion des combats
  - `battle-engine.service.ts`: Moteur de simulation des combats

- **Modèles**: Définition des entités via Prisma
  - Schéma Prisma: `prisma/schema.prisma`
  - DTOs: Objets de transfert de données pour la validation

### Frontend (Next.js)

- **Pages**:
  - `/`: Page d'accueil publique
  - `/login` et `/register`: Pages d'authentification
  - `/dashboard`: Tableau de bord utilisateur
  - `/kittens`: Gestion des chatons
  - `/battles`: Gestion et visualisation des combats

- **Components**: Composants réutilisables
  - Layout: Structure globale de l'application
  - AuthGuard: Protection des routes authentifiées

- **Store Redux**: Gestion de l'état global
  - `authSlice.ts`: Gestion de l'authentification
  - `kittenSlice.ts`: Gestion des chatons
  - `battleSlice.ts`: Gestion des combats

## Système de combat

Le système de combat est automatisé et basé sur les statistiques des chatons et leurs capacités. Les combats se déroulent en rounds, où chaque chaton utilise ses capacités en fonction de ses attributs:

- **Force**: Augmente les dégâts des attaques physiques
- **Agilité**: Améliore l'initiative et l'esquive
- **Constitution**: Augmente les points de vie et la résistance
- **Intelligence**: Augmente la puissance des capacités spéciales et de soin

Les différents types de capacités sont:
- **ATTACK**: Attaques physiques basées sur la force
- **DEFENSE**: Capacités défensives pour réduire les dégâts
- **SPECIAL**: Attaques spéciales basées sur l'intelligence
- **HEAL**: Capacités de soin basées sur l'intelligence
- **BUFF**: Capacités qui améliorent temporairement les attributs
- **DEBUFF**: Capacités qui réduisent temporairement les attributs de l'adversaire

## Progression du jeu

Les chatons gagnent de l'expérience en remportant des combats. Lorsqu'ils atteignent suffisamment d'expérience, ils gagnent un niveau et des points de compétence qui peuvent être attribués à leurs attributs.

## Déploiement

### Backend

Pour déployer le backend en production:

```bash
cd backend

# Compiler le projet
npm run build

# Démarrer le serveur en mode production
npm run start:prod
```

### Frontend

Pour construire le frontend pour la production:

```bash
cd frontend

# Construire le projet
npm run build

# Démarrer le serveur en mode production
npm run start
```

## Tests

### Backend

```bash
cd backend

# Exécuter les tests unitaires
npm run test

# Exécuter les tests e2e
npm run test:e2e

# Vérifier la couverture des tests
npm run test:cov
```

### Frontend

```bash
cd frontend

# Exécuter les tests
npm run test
```

## Contribution

1. Forkez le projet
2. Créez votre branche de fonctionnalité (`git checkout -b feature/amazing-feature`)
3. Commitez vos changements (`git commit -m 'Add some amazing feature'`)
4. Poussez sur la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

## Licence

MIT

## Auteurs

- [Villers](https://github.com/villers)
