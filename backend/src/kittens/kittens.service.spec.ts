import { describe, it, expect, beforeEach } from 'vitest';
import { createKittenFixture } from '../test/fixtures/kitten-fixture';
import { KittenFixture } from '../test/fixtures/kitten-fixture';
import { userBuilder } from '../test/builders/user.builder';
import { kittenBuilder } from '../test/builders/kitten.builder';
import { kittenStatsBuilder } from '../test/builders/kitten-stats.builder';

describe('KittensService', () => {
  let fixture: KittenFixture;

  beforeEach(() => {
    fixture = createKittenFixture();
    fixture.givenCurrentDate(new Date('2024-01-01T12:00:00Z'));
  });

  describe('createKitten', () => {
    it('should create a kitten with valid data', async () => {
      // Given
      const user = userBuilder()
        .withId('user-1')
        .withUsername('testuser')
        .withEmail('test@example.com')
        .build();

      fixture.givenUserExists([user]);

      // When
      await fixture.whenCreateKitten(
        {
          name: 'Test Kitten',
          strength: 7,
          agility: 6,
          constitution: 8,
          intelligence: 5,
        },
        user.id
      );

      // Then
      const expectedKitten = kittenBuilder()
        .withName('Test Kitten')
        .withStrength(7)
        .withAgility(6)
        .withConstitution(8)
        .withIntelligence(5)
        .withUserId(user.id)
        .build();

      fixture.thenAttributeShouldBe('name', expectedKitten.name);
      fixture.thenAttributeShouldBe('strength', expectedKitten.strength);
      fixture.thenAttributeShouldBe('agility', expectedKitten.agility);
      fixture.thenAttributeShouldBe('constitution', expectedKitten.constitution);
      fixture.thenAttributeShouldBe('intelligence', expectedKitten.intelligence);
      fixture.thenAttributeShouldBe('userId', expectedKitten.userId);
    });

    it('should fail if user does not exist', async () => {
      // When
      await fixture.whenCreateKitten(
        {
          name: 'Test Kitten',
        },
        'non-existent-user-id'
      );

      // Then
      fixture.thenErrorMessageShouldContain('User with ID non-existent-user-id not found');
    });

    it('should fail if kitten name already exists', async () => {
      // Given
      const user = userBuilder()
        .withId('user-1')
        .withUsername('testuser')
        .withEmail('test@example.com')
        .build();

      const existingKitten = kittenBuilder()
        .withId('kitten-1')
        .withName('Test Kitten')
        .withUserId(user.id)
        .build();

      fixture.givenUserExists([user]);
      fixture.givenKittenExists([existingKitten]);

      // When
      await fixture.whenCreateKitten(
        {
          name: 'Test Kitten',
        },
        user.id
      );

      // Then
      fixture.thenErrorMessageShouldContain('Kitten with name Test Kitten already exists');
    });
  });

  describe('assignSkillPoints', () => {
    it('should assign skill points correctly', async () => {
      // Given
      const user = userBuilder().withId('user-1').build();
      
      const kitten = kittenBuilder()
        .withId('kitten-1')
        .withName('Test Kitten')
        .withUserId(user.id)
        .withSkillPoints(10)
        .withStrength(5)
        .withAgility(5)
        .withConstitution(5)
        .withIntelligence(5)
        .build();

      fixture.givenUserExists([user]);
      fixture.givenKittenExists([kitten]);

      // When
      await fixture.whenAssignSkillPoints(
        kitten.id,
        {
          strength: 2,
          agility: 3,
          constitution: 1,
          intelligence: 4,
        },
        user.id
      );

      // Then
      fixture.thenAttributeShouldBe('strength', 7);
      fixture.thenAttributeShouldBe('agility', 8);
      fixture.thenAttributeShouldBe('constitution', 6);
      fixture.thenAttributeShouldBe('intelligence', 9);
      fixture.thenSkillPointsShouldBe(0);
    });

    it('should fail if not enough skill points', async () => {
      // Given
      const user = userBuilder().withId('user-1').build();
      
      const kitten = kittenBuilder()
        .withId('kitten-1')
        .withName('Test Kitten')
        .withUserId(user.id)
        .withSkillPoints(5)
        .build();

      fixture.givenUserExists([user]);
      fixture.givenKittenExists([kitten]);

      // When
      await fixture.whenAssignSkillPoints(
        kitten.id,
        {
          strength: 2,
          agility: 3,
          constitution: 1,
          intelligence: 4,
        },
        user.id
      );

      // Then
      fixture.thenErrorMessageShouldContain('Not enough skill points available');
    });

    it('should fail if kitten belongs to another user', async () => {
      // Given
      const user1 = userBuilder().withId('user-1').build();
      const user2 = userBuilder().withId('user-2').build();
      
      const kitten = kittenBuilder()
        .withId('kitten-1')
        .withName('Test Kitten')
        .withUserId(user1.id)
        .withSkillPoints(10)
        .build();

      fixture.givenUserExists([user1, user2]);
      fixture.givenKittenExists([kitten]);

      // When
      await fixture.whenAssignSkillPoints(
        kitten.id,
        {
          strength: 2,
          agility: 3,
          constitution: 1,
          intelligence: 4,
        },
        user2.id
      );

      // Then
      fixture.thenErrorMessageShouldContain('You can only update your own kittens');
    });
  });
});
