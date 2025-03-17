.PHONY: setup start-backend start-frontend start docker-up docker-down

# Configuration par défaut
BACKEND_PORT = 3001
FRONTEND_PORT = 3000

# Installation et configuration initiale du projet
setup:
	@echo "Setting up the project..."
	@./setup.sh

# Démarrer le backend en mode développement
start-backend:
	@echo "Starting backend on port $(BACKEND_PORT)..."
	@cd backend && npm run start:dev

# Démarrer le frontend en mode développement
start-frontend:
	@echo "Starting frontend on port $(FRONTEND_PORT)..."
	@cd frontend && npm run dev

# Démarrer le backend et le frontend en parallèle (nécessite tmux)
start:
	@echo "Starting both backend and frontend..."
	@if command -v tmux >/dev/null 2>&1; then \
		tmux new-session -d -s kitten-ia "cd backend && npm run start:dev"; \
		tmux split-window -h -t kitten-ia "cd frontend && npm run dev"; \
		tmux -2 attach-session -t kitten-ia; \
	else \
		echo "tmux is not installed. Please start backend and frontend separately."; \
		echo "Run: make start-backend in one terminal"; \
		echo "Run: make start-frontend in another terminal"; \
	fi

# Démarrer avec Docker Compose
docker-up:
	@echo "Starting with Docker Compose..."
	@docker-compose up -d --build

# Arrêter les conteneurs Docker
docker-down:
	@echo "Stopping Docker containers..."
	@docker-compose down

# Supprimer tous les conteneurs et volumes Docker
docker-clean:
	@echo "Cleaning Docker containers and volumes..."
	@docker-compose down -v

# Afficher les logs des conteneurs Docker
docker-logs:
	@echo "Showing Docker logs..."
	@docker-compose logs -f

# Exécuter les tests du backend
test-backend:
	@echo "Running backend tests..."
	@cd backend && npm run test

# Exécuter les tests du frontend
test-frontend:
	@echo "Running frontend tests..."
	@cd frontend && npm run test

# Exécuter tous les tests
test: test-backend test-frontend
	@echo "All tests completed!"

# Générer la documentation de l'API
generate-api-docs:
	@echo "Generating API documentation..."
	@cd backend && npm run start:dev &
	@echo "API documentation available at http://localhost:$(BACKEND_PORT)/api"
	@echo "Press Ctrl+C to stop the server when finished."
