import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CreateBattleCommand, CreateBattleUseCase } from '@/battles/application/usecases/create-battle.usecase';
import { Test } from '@nestjs/testing';
import { BattleTokens } from '@/battles/tokens/tokens';
import { KittenTokens } from '@/kittens/tokens/tokens';
import { Battle } from '@/battles/domain/battle';
import { BattleEngine } from '@/battles/domain/battle-engine';
import { KittenNotFoundError, NotOwnerError, SelfBattleError } from '@/battles/domain/errors';
import { createBattleFixture, BattleFixture } from '@/battles/tests/battle-fixture';
import { battleKittenBuilder } from '@/battles/tests/battle-kitten-builder';
import { battleAbilityBuilder } from '@/battles/tests/battle-ability-builder';
import { battleBuilder } from '@/battles/tests/battle-builder';
import { InMemoryBattleRepository } from '@/battles/tests/in-memory-battle-repository';
import { InMemoryKittenRepository } from '@/battles/tests/in-memory-kitten-repository';

describe('Create Battle Use Case', () => {
  let fixture: BattleFixture;
  let createBattleUseCase: CreateBattleUseCase;
  let battleRepository: InMemoryBattleRepository;
  let kittenRepository: InMemoryKittenRepository;
  let battleEngine: BattleEngine;

  beforeEach(async () => {
    fixture = createBattleFixture();
    
    // Utiliser le module de test NestJS pour gérer l'injection de dépendances
    const moduleRef = await Test.createTestingModule({
      providers: [
        CreateBattleUseCase,
        {
          provide: BattleTokens.BattleRepository,
          useClass: InMemoryBattleRepository,
        },
        {
          provide: KittenTokens.KittenRepository,
          useClass: InMemoryKittenRepository,
        },
        {
          provide: BattleTokens.BattleEngine,
          useClass: BattleEngine,
        },
      ],
    }).compile();

    createBattleUseCase = moduleRef.get<CreateBattleUseCase>(CreateBattleUseCase);
    battleRepository = moduleRef.get<InMemoryBattleRepository>(BattleTokens.BattleRepository);
    kittenRepository = moduleRef.get<InMemoryKittenRepository>(KittenTokens.KittenRepository);
    battleEngine = moduleRef.get<BattleEngine>(BattleTokens.BattleEngine);
    
    // Remplacer le repository de la fixture par celui du module
    fixture.setRepository(battleRepository);
    
    // Setup test kittens
    setupTestKittens();
  });

  // Helper to setup test kittens
  const setupTestKittens = () => {
    // Setup challenger
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
    
    // Setup opponent
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
    
    // Add test owner
    kittenRepository.addKitten(challenger, 'user-id');
    kittenRepository.addKitten(opponent, 'other-user-id');
  };

  it('should create a battle successfully', async () => {
    // Given
    const command = new CreateBattleCommand(
      'challenger-id',
      'opponent-id',
      'user-id'
    );

    // Create a fully formed battle to return from the mock
    const ability1 = battleAbilityBuilder().build();
    const challenger = battleKittenBuilder()
      .withId('challenger-id')
      .withName('Challenger')
      .withAbilities([ability1])
      .build();
      
    const ability2 = battleAbilityBuilder().build();
    const opponent = battleKittenBuilder()
      .withId('opponent-id')
      .withName('Opponent')
      .withAbilities([ability2])
      .build();
      
    const completedBattle = battleBuilder()
      .withId('battle-id')
      .withSeed(123456)
      .withChallenger(challenger)
      .withOpponent(opponent)
      .withRound(3)
      .withIsFinished(true)
      .withWinnerId('challenger-id')
      .withExperienceGain(15)
      .build();
      
    // Mock the battle engine to return a predetermined battle result
    vi.spyOn(battleEngine, 'simulateBattle').mockReturnValue(completedBattle);

    // When
    try {
      const result = await createBattleUseCase.execute(command);
      fixture.setResult(result);
    } catch (error) {
      fixture.setError(error as Error);
    }

    // Then
    expect(fixture.getError()).toBeNull();
    expect(fixture.getResult()).toBeDefined();
    
    const result = fixture.getResult() as Battle;
    expect(result.id).toBeDefined();
    expect(result.challenger.id).toBe('challenger-id');
    expect(result.opponent.id).toBe('opponent-id');
    expect(result.isFinished).toBe(true);
    expect(result.winnerId).toBe('challenger-id');
    expect(result.experienceGain).toBe(15);

    // Verify that repository methods were called
    expect(kittenRepository.updateStatsWasCalled).toBe(true);
    expect(kittenRepository.updateExperienceWasCalled).toBe(true);
  });

  it('should throw KittenNotFoundError if challenger is not found', async () => {
    // Given
    const command = new CreateBattleCommand(
      'non-existent-id',
      'opponent-id',
      'user-id'
    );

    // When
    try {
      const result = await createBattleUseCase.execute(command);
      fixture.setResult(result);
    } catch (error) {
      fixture.setError(error as Error);
    }

    // Then
    expect(fixture.getResult()).toBeNull();
    expect(fixture.getError()).toBeInstanceOf(KittenNotFoundError);
  });

  it('should throw KittenNotFoundError if opponent is not found', async () => {
    // Given
    const command = new CreateBattleCommand(
      'challenger-id',
      'non-existent-id',
      'user-id'
    );

    // When
    try {
      const result = await createBattleUseCase.execute(command);
      fixture.setResult(result);
    } catch (error) {
      fixture.setError(error as Error);
    }

    // Then
    expect(fixture.getResult()).toBeNull();
    expect(fixture.getError()).toBeInstanceOf(KittenNotFoundError);
  });

  it('should throw NotOwnerError if user is not the owner of the challenger', async () => {
    // Given
    const command = new CreateBattleCommand(
      'challenger-id',
      'opponent-id',
      'wrong-user-id'
    );

    // When
    try {
      const result = await createBattleUseCase.execute(command);
      fixture.setResult(result);
    } catch (error) {
      fixture.setError(error as Error);
    }

    // Then
    expect(fixture.getResult()).toBeNull();
    expect(fixture.getError()).toBeInstanceOf(NotOwnerError);
  });

  it('should throw SelfBattleError if challenger and opponent are the same', async () => {
    // Given
    const command = new CreateBattleCommand(
      'challenger-id',
      'challenger-id',
      'user-id'
    );

    // When
    try {
      const result = await createBattleUseCase.execute(command);
      fixture.setResult(result);
    } catch (error) {
      fixture.setError(error as Error);
    }

    // Then
    expect(fixture.getResult()).toBeNull();
    expect(fixture.getError()).toBeInstanceOf(SelfBattleError);
  });
});