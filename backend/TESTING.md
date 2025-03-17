# Guide de test avec Vitest pour Kitten-IA

Ce projet utilise [Vitest](https://vitest.dev/) comme framework de test pour faciliter le développement TDD (Test-Driven Development).

## Commandes disponibles

- `npm test` : Execute tous les tests une fois
- `npm run test:watch` : Execute les tests en mode watch (réexécute les tests à chaque modification de fichier)
- `npm run test:cov` : Execute les tests avec génération de rapport de couverture
- `npm run test:ui` : Lance l'interface utilisateur de Vitest pour une visualisation interactive des tests
- `npm run test:debug` : Exécute les tests en mode debug
- `npm run test:e2e` : Exécute les tests end-to-end

## Structure des tests

Les tests sont organisés selon les conventions suivantes :

- Les tests unitaires sont placés à côté des fichiers de code source avec l'extension `.spec.ts`
- Les tests d'intégration et end-to-end utilisent l'extension `.e2e-spec.ts`

## Utilisation des Builders et Fixtures

Pour faciliter l'écriture des tests, le projet utilise un système de Builders et Fixtures :

### Builders

Les builders permettent de créer facilement des instances d'objets de domaine pour les tests.
Exemple d'utilisation :

```typescript
import { kittenBuilder } from './tests/builders/kitten.builder';

// Créer un chaton avec des valeurs par défaut
const kitten = kittenBuilder().build();

// Ou personnaliser certaines propriétés
const customKitten = kittenBuilder()
  .withName('Garfield')
  .withLevel(5)
  .build();
```

### Fixtures

Les fixtures facilitent la mise en place de scénarios de test avec un style BDD (Behavior-Driven Development).
Exemple d'utilisation :

```typescript
import { CreateKittenFixture } from './tests/fixtures/kitten.fixture';

describe('Feature: Kitten Creation', () => {
  let fixture: KittenFixture;

  beforeEach(() => {
    fixture = CreateKittenFixture();
  });

  test('creates a kitten with valid details', async () => {
    // Arrange
    fixture.givenUsersExists([user]);
    
    // Act
    await fixture.whenKittenIsCreate({
      name: 'Felix',
      user: 1,
    });
    
    // Assert
    await fixture.thenKittenShouldExist({
      name: 'Felix',
      user: 1,
    });
  });
});
```

## Bonnes pratiques

1. **Suivre le principe AAA (Arrange-Act-Assert)**
2. **Utiliser les builders et fixtures** pour simplifier la mise en place des tests
3. **Tester les cas d'erreur** en plus des cas de succès
4. **Isoler les tests** pour qu'ils puissent s'exécuter indépendamment
5. **Écrire les tests avant le code** pour suivre le TDD
