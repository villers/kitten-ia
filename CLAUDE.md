# CLAUDE.md - Kitten-IA Repository Guide

## Build/Test Commands
- Backend: `cd backend && npm run start:dev` (run development server)
- Frontend: `cd frontend && npm run dev` (start Next.js dev server)
- Run all tests: `cd backend && npm run test`
- Run single test: `cd backend && npm run test -- <file-path>` (e.g., `npm run test -- src/kittens/tests/usecases/create-kitten.usecase.spec.ts`)
- Test watch mode: `cd backend && npm run test:watch`
- Backend linting: `cd backend && npm run lint`
- Frontend linting: `cd frontend && npm run lint`
- Build backend: `cd backend && npm run build`
- Build frontend: `cd frontend && npm run build`

## Code Style Guidelines
- **Imports**: Use absolute imports with `@/` prefix (e.g., `import { Kitten } from '@/kittens/domain/kitten'`)
- **DDD Structure**: Follow Domain-Driven Design patterns with clear separation between domain, application, and infrastructure layers
- **Naming**: Use `PascalCase` for classes and `camelCase` for variables/methods; prefix private members with `_`
- **Testing**: Use `describe`/`it`/`expect` pattern; use fixtures and builders for test
- **Error Handling**: Create domain-specific error classes; use try/catch for async operations
- **Domain Objects**: Use immutable objects with private properties and public getters
- **TypeScript**: Use strict null checks and strong typing throughout the codebase
- **Code Organization**: Keep related code (domain models, usecases, repositories) in feature folders