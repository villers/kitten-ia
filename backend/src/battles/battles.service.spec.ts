import { describe, it, expect, beforeEach } from 'vitest';
import { createBattleFixture } from '../test/fixtures/battle-fixture';
import { BattleFixture } from '../test/fixtures/battle-fixture';
import { userBuilder } from '../test/builders/user.builder';
import { kittenBuilder } from '../test/builders/kitten.builder';
import { battleLogBuilder } from '../test/builders/battle-log.builder';
import { BattleStatus } from '@prisma/client';

describe('BattlesService', () => {
  let fixture: BattleFixture;

  beforeEach(() => {
    fixture = createBattleFixture();
    fixture.givenCurrentDate(new Date('2024-01-01T12:00:00Z'));
    fixture.givenRandomSeed(123456);
  });

  describe('createBattle', () => {
    it('should create a battle between two kittens', async () => {
      // Given
      const user1 = userBuilder().withId('user-1').build();
      const user2 = userBuilder().withId('user-2').build();
      
      const challenger = kittenBuilder()
        .withId('kitten-1')
        .withName('Challenger Kitten')
        .withUserId(user1.id)
        .build();
      
      const opponent = kittenBuilder()
        .withId('kitten-2')
        .withName('Opponent Kitten')
        .withUserId(user2.id)
        .build();

      fixture.givenUserExists([user1, user2]);
      fixture.givenKittenExists([challenger, opponent]);

      // When
      await fixture.whenCreateBattle(
        {
          opponentId: opponent.id,
        },
        challenger.id,
        user1.id
      );

      // Then
      fixture.thenBattleStatusShouldBe(BattleStatus.COMPLETED);
      fixture.thenWinnerShouldBe(challenger.id);
      fixture.thenBattleMovesShouldHaveLength(1);

      // The challenger should gain experience
      const kittenRepo = fixture.getKittenRepository();
      const updatedChallenger = await kittenRepo.findById(challenger.id);
      expect(updatedChallenger?.experience).toBe(50);
    });

    it('should fail if challenger kitten does not exist', async () => {
      // Given
      const user = userBuilder().withId('user-1').build();
      const opponent = kittenBuilder()
        .withId('kitten-2')
        .withName('Opponent Kitten')
        .withUserId(user.id)
        .build();

      fixture.givenUserExists([user]);
      fixture.givenKittenExists([opponent]);

      // When
      await fixture.whenCreateBattle(
        {
          opponentId: opponent.id,
        },
        'non-existent-kitten-id',
        user.id
      );

      // Then
      fixture.thenErrorMessageShouldContain('Challenger kitten with ID non-existent-kitten-id not found');
    });

    it('should fail if opponent kitten does not exist', async () => {
      // Given
      const user = userBuilder().withId('user-1').build();
      const challenger = kittenBuilder()
        .withId('kitten-1')
        .withName('Challenger Kitten')
        .withUserId(user.id)
        .build();

      fixture.givenUserExists([user]);
      fixture.givenKittenExists([challenger]);

      // When
      await fixture.whenCreateBattle(
        {
          opponentId: 'non-existent-kitten-id',
        },
        challenger.id,
        user.id
      );

      // Then
      fixture.thenErrorMessageShouldContain('Opponent kitten with ID non-existent-kitten-id not found');
    });

    it('should fail if challenger does not belong to the user', async () => {
      // Given
      const user1 = userBuilder().withId('user-1').build();
      const user2 = userBuilder().withId('user-2').build();
      
      const challenger = kittenBuilder()
        .withId('kitten-1')
        .withName('Challenger Kitten')
        .withUserId(user1.id)
        .build();
      
      const opponent = kittenBuilder()
        .withId('kitten-2')
        .withName('Opponent Kitten')
        .withUserId(user2.id)
        .build();

      fixture.givenUserExists([user1, user2]);
      fixture.givenKittenExists([challenger, opponent]);

      // When - user2 tries to battle with user1's kitten
      await fixture.whenCreateBattle(
        {
          opponentId: opponent.id,
        },
        challenger.id,
        user2.id
      );

      // Then
      fixture.thenErrorMessageShouldContain('You can only battle with your own kittens');
    });

    it('should fail if a kitten tries to battle against itself', async () => {
      // Given
      const user = userBuilder().withId('user-1').build();
      const kitten = kittenBuilder()
        .withId('kitten-1')
        .withName('Kitten')
        .withUserId(user.id)
        .build();

      fixture.givenUserExists([user]);
      fixture.givenKittenExists([kitten]);

      // When
      await fixture.whenCreateBattle(
        {
          opponentId: kitten.id,
        },
        kitten.id,
        user.id
      );

      // Then
      fixture.thenErrorMessageShouldContain('A kitten cannot battle against itself');
    });
  });

  describe('findBattleById', () => {
    it('should find battle by id', async () => {
      // Given
      const user1 = userBuilder().withId('user-1').build();
      const user2 = userBuilder().withId('user-2').build();
      
      const challenger = kittenBuilder()
        .withId('kitten-1')
        .withName('Challenger Kitten')
        .withUserId(user1.id)
        .build();
      
      const opponent = kittenBuilder()
        .withId('kitten-2')
        .withName('Opponent Kitten')
        .withUserId(user2.id)
        .build();

      const battle = battleLogBuilder()
        .withId('battle-1')
        .withChallengerId(challenger.id)
        .withOpponentId(opponent.id)
        .withWinnerId(challenger.id)
        .build();

      fixture.givenUserExists([user1, user2]);
      fixture.givenKittenExists([challenger, opponent]);
      fixture.givenBattleExists([battle]);

      // When
      await fixture.whenFindBattleById(battle.id);

      // Then
      fixture.thenBattleShouldExist(battle);
    });

    it('should fail if battle not found', async () => {
      // When
      await fixture.whenFindBattleById('non-existent-battle-id');

      // Then
      fixture.thenErrorMessageShouldContain('Battle with ID non-existent-battle-id not found');
    });
  });
});
