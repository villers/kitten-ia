import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test } from '@nestjs/testing';
import { BattleTokens } from '@/battles/tokens/tokens';
import { FindAllBattlesQuery, FindAllBattlesUseCase } from '@/battles/application/usecases/find-all-battles.usecase';
import { Battle } from '@/battles/domain/battle';
import { createBattleFixture, BattleFixture } from '@/battles/tests/battle-fixture';
import { battleBuilder } from '@/battles/tests/battle-builder';
import { battleKittenBuilder } from '@/battles/tests/battle-kitten-builder';
import { battleAbilityBuilder } from '@/battles/tests/battle-ability-builder';
import { InMemoryBattleRepository } from '@/battles/tests/in-memory-battle-repository';

describe('Find All Battles Use Case', () => {
  let fixture: BattleFixture;
  let findAllBattlesUseCase: FindAllBattlesUseCase;
  let battleRepository: InMemoryBattleRepository;

  beforeEach(async () => {
    fixture = createBattleFixture();
    
    // Utiliser le module de test NestJS pour gérer l'injection de dépendances
    const moduleRef = await Test.createTestingModule({
      providers: [
        FindAllBattlesUseCase,
        {
          provide: BattleTokens.BattleRepository,
          useClass: InMemoryBattleRepository,
        },
      ],
    }).compile();

    findAllBattlesUseCase = moduleRef.get<FindAllBattlesUseCase>(FindAllBattlesUseCase);
    battleRepository = moduleRef.get<InMemoryBattleRepository>(BattleTokens.BattleRepository);
    
    // Remplacer le repository de la fixture par celui du module
    fixture.setRepository(battleRepository);
    
    // Setup test data
    setupTestBattles();
  });

  // Helper to setup test battles
  const setupTestBattles = () => {
    // Create abilities
    const ability1 = battleAbilityBuilder()
      .withId('ability1')
      .withName('Scratch')
      .withDescription('A basic attack')
      .withType('ATTACK')
      .withPower(10)
      .withAccuracy(90)
      .withCooldown(0)
      .build();
      
    const ability2 = battleAbilityBuilder()
      .withId('ability2')
      .withName('Bite')
      .withDescription('A stronger attack')
      .withType('ATTACK')
      .withPower(15)
      .withAccuracy(85)
      .withCooldown(1)
      .build();
    
    // Create kittens
    const kitten1 = battleKittenBuilder()
      .withId('kitten1')
      .withName('Fluffy')
      .withLevel(1)
      .withStrength(5)
      .withAgility(5)
      .withConstitution(5)
      .withIntelligence(5)
      .withAbilities([ability1])
      .build();
      
    const kitten2 = battleKittenBuilder()
      .withId('kitten2')
      .withName('Whiskers')
      .withLevel(1)
      .withStrength(6)
      .withAgility(4)
      .withConstitution(6)
      .withIntelligence(4)
      .withAbilities([ability2])
      .build();
      
    const kitten3 = battleKittenBuilder()
      .withId('kitten3')
      .withName('Shadow')
      .withLevel(2)
      .withStrength(7)
      .withAgility(6)
      .withConstitution(5)
      .withIntelligence(6)
      .withAbilities([ability1, ability2])
      .build();
    
    // Create battles
    const battle1 = battleBuilder()
      .withId('battle1')
      .withSeed(123456)
      .withChallenger(kitten1)
      .withOpponent(kitten2)
      .withRound(3)
      .withIsFinished(true)
      .withWinnerId('kitten1')
      .withExperienceGain(15)
      .build();
    
    const battle2 = battleBuilder()
      .withId('battle2')
      .withSeed(234567)
      .withChallenger(kitten2)
      .withOpponent(kitten3)
      .withRound(5)
      .withIsFinished(true)
      .withWinnerId('kitten3')
      .withExperienceGain(20)
      .build();
    
    // Store battles in fixture
    fixture.givenBattleExists([battle1, battle2]);
    
    // Setup mock implementation for findByUserId
    vi.spyOn(battleRepository, 'findByUserId').mockImplementation(async (userId: string) => {
      if (userId === 'user1') {
        return [battle1];
      } else if (userId === 'user2') {
        return [battle2];
      }
      return [];
    });
  };

  it('should find all battles', async () => {
    // Given
    const query = new FindAllBattlesQuery();
    
    // When
    try {
      const result = await findAllBattlesUseCase.execute(query);
      fixture.setResult(result);
    } catch (error) {
      fixture.setError(error as Error);
    }
    
    // Then
    expect(fixture.getError()).toBeNull();
    
    const result = fixture.getResult() as Battle[];
    expect(result).toBeDefined();
    expect(result.length).toBe(2);
    expect(result.some(battle => battle.id === 'battle1')).toBe(true);
    expect(result.some(battle => battle.id === 'battle2')).toBe(true);
  });

  it('should find battles for a specific user', async () => {
    // Given
    const query = new FindAllBattlesQuery('user1');
    
    // When
    try {
      const result = await findAllBattlesUseCase.execute(query);
      fixture.setResult(result);
    } catch (error) {
      fixture.setError(error as Error);
    }
    
    // Then
    expect(fixture.getError()).toBeNull();
    
    const result = fixture.getResult() as Battle[];
    expect(result).toBeDefined();
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('battle1');
  });

  it('should return empty array if no battles found for user', async () => {
    // Given
    const query = new FindAllBattlesQuery('unknown-user');
    
    // When
    try {
      const result = await findAllBattlesUseCase.execute(query);
      fixture.setResult(result);
    } catch (error) {
      fixture.setError(error as Error);
    }
    
    // Then
    expect(fixture.getError()).toBeNull();
    
    const result = fixture.getResult() as Battle[];
    expect(result).toBeDefined();
    expect(result.length).toBe(0);
  });
});