import { describe, it, expect, beforeEach } from 'vitest';
import { Battle } from '@/battles/domain/battle';
import { BattleKitten } from '@/battles/domain/battle-kitten';
import { battleBuilder } from '@/battles/tests/battle-builder';
import { battleKittenBuilder } from '@/battles/tests/battle-kitten-builder';
import { battleAbilityBuilder } from '@/battles/tests/battle-ability-builder';
import { battleLogEntryBuilder } from '@/battles/tests/battle-log-entry-builder';

describe('Battle Domain', () => {
  // Utils for tests
  let deadKitten: BattleKitten;
  let aliveKitten: BattleKitten;
  
  beforeEach(() => {
    deadKitten = battleKittenBuilder()
      .withId('dead-kitten-id')
      .withName('Dead Kitten')
      .withCurrentHealth(0)
      .build();
    
    aliveKitten = battleKittenBuilder()
      .withId('alive-kitten-id')
      .withName('Alive Kitten')
      .withCurrentHealth(100)
      .build();
  });

  it('should create a battle with initial state', () => {
    // Arrange
    const challengerId = 'challenger-id';
    const opponentId = 'opponent-id';
    const battleId = 'battle-id';
    const seed = 123456;
    
    const ability = battleAbilityBuilder().build();
    
    const challenger = battleKittenBuilder()
      .withId(challengerId)
      .withName('Challenger')
      .withAbilities([ability])
      .build();
      
    const opponent = battleKittenBuilder()
      .withId(opponentId)
      .withName('Opponent')
      .withAbilities([ability])
      .build();
    
    // Act
    const battle = battleBuilder()
      .withId(battleId)
      .withSeed(seed)
      .withChallenger(challenger)
      .withOpponent(opponent)
      .build();
    
    // Assert
    expect(battle.id).toBe(battleId);
    expect(battle.seed).toBe(seed);
    expect(battle.challenger.id).toBe(challengerId);
    expect(battle.opponent.id).toBe(opponentId);
    expect(battle.round).toBe(0);
    expect(battle.logs).toHaveLength(0);
    expect(battle.isFinished).toBe(false);
    expect(battle.winnerId).toBeUndefined();
    expect(battle.experienceGain).toBe(0);
  });
  
  it('should add log entry to battle', () => {
    // Arrange
    const challengerId = 'challenger-id';
    const opponentId = 'opponent-id';
    const battleId = 'battle-id';
    const seed = 123456;
    
    const ability = battleAbilityBuilder().build();
    
    const challenger = battleKittenBuilder()
      .withId(challengerId)
      .withName('Challenger')
      .withAbilities([ability])
      .build();
      
    const opponent = battleKittenBuilder()
      .withId(opponentId)
      .withName('Opponent')
      .withAbilities([ability])
      .build();
    
    const battle = battleBuilder()
      .withId(battleId)
      .withSeed(seed)
      .withChallenger(challenger)
      .withOpponent(opponent)
      .build();
    
    const logEntry = battleLogEntryBuilder()
      .withRound(1)
      .withTurn(1)
      .withAttackerId(challengerId)
      .withDefenderId(opponentId)
      .withAbilityId(ability.id)
      .withAbilityName(ability.name)
      .withDamage(10)
      .withMessage('Challenger attacks Opponent with Test Ability and deals 10 damage!')
      .withAttackerHealth(100)
      .withDefenderHealth(90)
      .build();
    
    // Act
    const updatedBattle = battle.addLog(logEntry);
    
    // Assert
    expect(updatedBattle.logs).toHaveLength(1);
    expect(updatedBattle.logs[0]).toBe(logEntry);
  });
  
  it('should finish a battle with a winner', () => {
    // Arrange
    const challengerId = 'challenger-id';
    const opponentId = 'opponent-id';
    const battleId = 'battle-id';
    const seed = 123456;
    
    const ability = battleAbilityBuilder().build();
    
    const challenger = battleKittenBuilder()
      .withId(challengerId)
      .withName('Challenger')
      .withAbilities([ability])
      .build();
      
    const opponent = battleKittenBuilder()
      .withId(opponentId)
      .withName('Opponent')
      .withAbilities([ability])
      .build();
    
    const battle = battleBuilder()
      .withId(battleId)
      .withSeed(seed)
      .withChallenger(challenger)
      .withOpponent(opponent)
      .build();
    
    // Act
    const updatedBattle = battle.finish(challengerId);
    
    // Assert
    expect(updatedBattle.isFinished).toBe(true);
    expect(updatedBattle.winnerId).toBe(challengerId);
  });
  
  it('should correctly determine winner when challenger is dead', () => {
    // Arrange
    const battleId = 'battle-id';
    const seed = 123456;
    
    // Vérifions que le chaton est bien mort
    expect(deadKitten.currentHealth).toBe(0);
    expect(deadKitten.isDead()).toBe(true);
    
    const battle = battleBuilder()
      .withId(battleId)
      .withSeed(seed)
      .withChallenger(deadKitten)
      .withOpponent(aliveKitten)
      .build();
    
    // Act
    const winner = battle.determineWinner();
    
    // Assert
    expect(winner).toBe(aliveKitten.id);
  });
  
  it('should correctly determine winner when opponent is dead', () => {
    // Arrange
    const battleId = 'battle-id';
    const seed = 123456;
    
    // Vérifions que le chaton est bien mort
    expect(deadKitten.currentHealth).toBe(0);
    expect(deadKitten.isDead()).toBe(true);
    
    const battle = battleBuilder()
      .withId(battleId)
      .withSeed(seed)
      .withChallenger(aliveKitten)
      .withOpponent(deadKitten)
      .build();
    
    // Act
    const winner = battle.determineWinner();
    
    // Assert
    expect(winner).toBe(aliveKitten.id);
  });
  
  it('should return undefined as winner when both kittens are alive', () => {
    // Arrange
    const challengerId = 'challenger-id';
    const opponentId = 'opponent-id';
    const battleId = 'battle-id';
    const seed = 123456;
    
    const ability = battleAbilityBuilder().build();
    
    const challenger = battleKittenBuilder()
      .withId(challengerId)
      .withName('Challenger')
      .withAbilities([ability])
      .build();
      
    const opponent = battleKittenBuilder()
      .withId(opponentId)
      .withName('Opponent')
      .withAbilities([ability])
      .build();
    
    const battle = battleBuilder()
      .withId(battleId)
      .withSeed(seed)
      .withChallenger(challenger)
      .withOpponent(opponent)
      .build();
    
    // Act
    const winner = battle.determineWinner();
    
    // Assert
    expect(winner).toBeUndefined();
  });
});