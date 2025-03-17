#!/bin/bash

# Fonction pour afficher des messages colorés
function echo_color() {
  GREEN='\033[0;32m'
  NC='\033[0m' # No Color
  echo -e "${GREEN}$1${NC}"
}

# Initialiser le dépôt Git s'il n'existe pas déjà
if [ ! -d ".git" ]; then
  echo_color "Initializing Git repository..."
  git init
else
  echo_color "Git repository already initialized."
fi

# Ajouter tous les fichiers au suivi Git
echo_color "Adding files to Git..."
git add .

# Faire le premier commit
echo_color "Making initial commit..."
git commit -m "Initial commit: Project structure setup"

# Configuration du remote (à personnaliser)
echo_color "To push to GitHub, run the following commands:"
echo_color "  git remote add origin https://github.com/villers/kitten-ia.git"
echo_color "  git branch -M main"
echo_color "  git push -u origin main"
