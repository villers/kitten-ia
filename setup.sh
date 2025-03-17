#!/bin/bash

# Fonction pour afficher des messages colorés
function echo_color() {
  GREEN='\033[0;32m'
  NC='\033[0m' # No Color
  echo -e "${GREEN}$1${NC}"
}

# Installation des dépendances du backend
echo_color "Installing backend dependencies..."
cd backend
npm install

# Génération du client Prisma
echo_color "Generating Prisma client..."
npm run prisma:generate

# Création des migrations
echo_color "Creating database migrations..."
npm run prisma:migrate

# Lancement du seed (données de test)
echo_color "Seeding database with test data..."
npm run prisma:seed

# Retour à la racine
cd ..

# Installation des dépendances du frontend
echo_color "Installing frontend dependencies..."
cd frontend
npm install

# Retour à la racine
cd ..

echo_color "Setup complete! You can now run the project:"
echo_color "  - Backend: cd backend && npm run start:dev"
echo_color "  - Frontend: cd frontend && npm run dev"
