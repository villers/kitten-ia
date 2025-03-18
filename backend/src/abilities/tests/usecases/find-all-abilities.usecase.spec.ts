import { describe, it, expect, beforeEach } from 'vitest';
import { AbilityType } from '@prisma/client';
import { Ability } from '../../domain/ability';
import { FindAllAbilitiesUseCase } from '../../application/usecases/find-all-abilities.usecase';
import { InMemoryAbilityRepository } from '../in-memory-ability-repository';

describe('FindAllAbilitiesUseCase', () => {
  let abilityRepository: InMemoryAbilityRepository;
  let findAllAbilitiesUseCase: FindAllAbilitiesUseCase;
  
  const kittenId1 = 'kitten-1';
  const kittenId2 = 'kitten-2';

  beforeEach(() => {
    abilityRepository = new InMemoryAbilityRepository();
    findAllAbilitiesUseCase = new FindAllAbilitiesUseCase(abilityRepository);
    
    // Créer des capacités de test pour deux chatons différents
    const ability1 = new Ability(
      'ability-1',
      'Scratch Attack',
      'A powerful scratch attack',
      AbilityType.ATTACK,
      30,
      90,
      2,
      kittenId1,
      new Date(),
      new Date()
    );
    
    const ability2 = new Ability(
      'ability-2',
      'Healing Purr',
      'A soothing purr that heals',
      AbilityType.HEAL,
      25,
      100,
      3,
      kittenId1,
      new Date(),
      new Date()
    );
    
    const ability3 = new Ability(
      'ability-3',
      'Quick Dodge',
      'Dodge the next attack',
      AbilityType.DEFENSE,
      0,
      95,
      2,
      kittenId2,
      new Date(),
      new Date()
    );
    
    abilityRepository.addAbility(ability1);
    abilityRepository.addAbility(ability2);
    abilityRepository.addAbility(ability3);
  });

  it('should find all abilities', async () => {
    // Given
    const query = {};

    // When
    const abilities = await findAllAbilitiesUseCase.execute(query);

    // Then
    expect(abilities).toHaveLength(3);
  });

  it('should find abilities for a specific kitten', async () => {
    // Given
    const query = {
      kittenId: kittenId1
    };

    // When
    const abilities = await findAllAbilitiesUseCase.execute(query);

    // Then
    expect(abilities).toHaveLength(2);
    expect(abilities.every(a => a.kittenId === kittenId1)).toBe(true);
  });

  it('should return empty array when no abilities found for a kitten', async () => {
    // Given
    const query = {
      kittenId: 'non-existent-kitten'
    };

    // When
    const abilities = await findAllAbilitiesUseCase.execute(query);

    // Then
    expect(abilities).toHaveLength(0);
  });
});
