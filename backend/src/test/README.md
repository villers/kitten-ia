# Test Utils for Kitten-IA

Ce dossier contient les utilitaires de test pour faciliter l'écriture de tests dans un style BDD (Behavior-Driven Development) avec Vitest.

## Structure

```
test/
├── builders/          # Builders pour créer des objets de test
├── fixtures/          # Fixtures pour préparer les scénarios de test 
├── repositories/      # Repositories en mémoire pour les tests
└── README.md          # Ce fichier
```

## Builders

Les builders permettent de créer facilement des objets de domaine pour les tests. Ils suivent le pattern Builder et permettent de créer des objets avec des valeurs par défaut qui peuvent être facilement personnalisées.

### Exemple d'utilisation

```typescript
import { kittenBuilder } from './test/builders';

// Créer un chaton avec des valeurs par défaut
const kitten = kittenBuilder().build();

// Ou personnaliser certaines propriétés
const customKitten = kittenBuilder()
  .withName('Garfield')
  .withLevel(5)
  .withStrength(10)
  .build();
```

## Fixtures

Les fixtures facilitent la mise en place de scénarios de test avec un style BDD. Elles fournissent des méthodes pour préparer l'état initial (given), exécuter l'action à tester (when) et vérifier les résultats (then).

### Exemple d'utilisation

```typescript
import { createKittenFixture } from './test/fixtures';

describe('Feature: Kitten Creation', () => {
  let fixture: KittenFixture;

  beforeEach(() => {
    fixture = createKittenFixture();
  });

  test('creates a kitten with valid details', async () => {
    // Given
    const user = userBuilder().build();
    fixture.givenUserExists([user]);
    fixture.givenCurrentDate(new Date('2024-01-01'));
    
    // When
    await fixture.whenCreateKitten({
      name: 'Felix',
      strength: 7,
    }, user.id);
    
    // Then
    fixture.thenAttributeShouldBe('name', 'Felix');
    fixture.thenAttributeShouldBe('strength', 7);
  });
});
```

## Repositories In-Memory

Les repositories in-memory permettent de simuler l'accès aux données sans dépendre d'une base de données réelle. Ils sont utilisés par les fixtures pour stocker et récupérer des données pendant les tests.

### Caractéristiques principales

- Isolation complète entre les tests
- Rapidité d'exécution
- Possibilité de préparer des états spécifiques
- Simulation des erreurs et des cas limites

### Exemple d'utilisation directe

```typescript
import { InMemoryKittenRepository } from './test/repositories/in-memory-kitten-repository';

// Créer un repository
const repository = new InMemoryKittenRepository();

// Ajouter des données
await repository.save(kitten);

// Récupérer des données
const result = await repository.findById(kitten.id);
```

## Bonnes pratiques

1. **Organisez les tests par fonctionnalité** : Utilisez des describes imbriqués pour regrouper les tests liés
2. **Utilisez le pattern Given-When-Then** : Pour une lisibilité maximale
3. **Un test = un scénario** : Chaque test doit vérifier un seul scénario
4. **Isolation** : Les tests ne doivent pas dépendre les uns des autres
5. **Nommage explicite** : Donnez des noms clairs à vos tests qui décrivent le comportement attendu
