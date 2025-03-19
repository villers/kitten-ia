import { describe, it, expect, beforeEach } from 'vitest';
import { Test } from '@nestjs/testing';
import { BattleTokens } from '@/battles/tokens/tokens';
import { FindBattleByIdQuery, FindBattleByIdUseCase } from '@/battles/application/usecases/find-battle-by-id.usecase';
import { Battle } from '@/battles/domain/battle';
import { BattleNotFoundError } from '@/battles/domain/errors';
import { createBattleFixture, BattleFixture } from '@/battles/tests/battle-fixture';
import { battleBuilder } from '@/battles/tests/battle-builder';
import { battleKittenBuilder } from '@/battles/tests/battle-kitten-builder';
import { battleAbilityBuilder } from '@/battles/tests/battle-ability-builder';
import { InMemoryBattleRepository } from '@/battles/tests/in-memory-battle-repository';

describe('Find Battle By Id Use Case', () => {
  let fixture: BattleFixture;
  let findBattleByIdUseCase: FindBattleByIdUseCase;
  let battleRepository: InMemoryBattleRepository;

  beforeEach(async () => {
    fixture = createBattleFixture();
    
    // Utiliser le module de test NestJS pour gérer l'injection de dépendances
    const moduleRef = await Test.createTestingModule({
      providers: [
        FindBattleByIdUseCase,
        {
          provide: BattleTokens.BattleRepository,
          useClass: InMemoryBattleRepository,
        },
      ],
    }).compile();

    findBattleByIdUseCase = moduleRef.get<FindBattleByIdUseCase>(FindBattleByIdUseCase);
    battleRepository = moduleRef.get<InMemoryBattleRepository>(BattleTokens.BattleRepository);
    
    // Remplacer le repository de la fixture par celui du module
    fixture.setRepository(battleRepository);
    
    // Setup test battle
    setupTestBattle();
  });

  // Helper to setup a test battle
  const setupTestBattle = () => {
    const ability1 = battleAbilityBuilder()
      .withId('ability1')
      .withName('Scratch')
      .withDescription('A basic attack')
      .withType('ATTACK')
      .withPower(10)
      .withAccuracy(90)
      .withCooldown(0)
      .build();
    
    const challenger = battleKittenBuilder()
      .withId('challenger-id')
      .withName('Fluffy')
      .withLevel(1)
      .withStrength(5)
      .withAgility(5)
      .withConstitution(5)
      .withIntelligence(5)
      .withAbilities([ability1])
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
    
    const opponent = battleKittenBuilder()
      .withId('opponent-id')
      .withName('Whiskers')
      .withLevel(1)
      .withStrength(6)
      .withAgility(4)
      .withConstitution(6)
      .withIntelligence(4)
      .withAbilities([ability2])
      .build();
    
    const battle = battleBuilder()
      .withId('battle-id')
      .withSeed(123456)
      .withChallenger(challenger)
      .withOpponent(opponent)
      .withRound(3)
      .withIsFinished(true)
      .withWinnerId('challenger-id')
      .withExperienceGain(15)
      .build();
    
    fixture.givenBattleExists([battle]);
  };

  it('should find a battle by id', async () => {
    // Given
    const query = new FindBattleByIdQuery('battle-id');
    
    // When
    try {
      const result = await findBattleByIdUseCase.execute(query);
      fixture.setResult(result);
    } catch (error) {
      fixture.setError(error as Error);
    }
    
    // Then
    expect(fixture.getError()).toBeNull();
    
    const result = fixture.getResult() as Battle;
    expect(result).toBeDefined();
    expect(result.id).toBe('battle-id');
    expect(result.challenger.id).toBe('challenger-id');
    expect(result.opponent.id).toBe('opponent-id');
    expect(result.isFinished).toBe(true);
    expect(result.winnerId).toBe('challenger-id');
    expect(result.experienceGain).toBe(15);
  });

  it('should throw BattleNotFoundError if battle is not found', async () => {
    // Given
    const query = new FindBattleByIdQuery('non-existent-id');
    
    // When
    try {
      const result = await findBattleByIdUseCase.execute(query);
      fixture.setResult(result);
    } catch (error) {
      fixture.setError(error as Error);
    }
    
    // Then
    expect(fixture.getResult()).toBeNull();
    expect(fixture.getError()).toBeInstanceOf(BattleNotFoundError);
    expect(fixture.getError()?.message).toContain('non-existent-id');
  });
});