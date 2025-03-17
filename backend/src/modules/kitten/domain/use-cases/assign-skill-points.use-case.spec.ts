import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AssignSkillPointsUseCase } from './assign-skill-points.use-case';
import { KittenRepository } from '../repositories/kitten-repository.interface';

describe('AssignSkillPointsUseCase', () => {
  let assignSkillPointsUseCase: AssignSkillPointsUseCase;
  let mockKittenRepository: KittenRepository;

  beforeEach(() => {
    mockKittenRepository = {
      findById: vi.fn(),
      findByUserId: vi.fn(),
      findByName: vi.fn(),
      save: vi.fn(),
      delete: vi.fn(),
      updateExperience: vi.fn(),
      levelUp: vi.fn(),
      assignSkillPoints: vi.fn(),
    };

    assignSkillPointsUseCase = new AssignSkillPointsUseCase(mockKittenRepository);
  });

  it('should throw an error if kitten does not exist', async () => {
    // Arrange
    const assignSkillPointsDto = {
      strength: 2,
      agility: 3,
      constitution: 1,
      intelligence: 4,
    };
    
    const kittenId = 'non-existent-kitten-id';
    const userId = 'user-id';
    
    mockKittenRepository.findById = vi.fn().mockResolvedValue(null);

    // Act & Assert
    await expect(assignSkillPointsUseCase.execute(kittenId, assignSkillPointsDto, userId))
      .rejects
      .toThrow('Kitten with ID non-existent-kitten-id not found');
    
    expect(mockKittenRepository.findById).toHaveBeenCalledWith(kittenId);
    expect(mockKittenRepository.assignSkillPoints).not.toHaveBeenCalled();
  });

  it('should throw an error if kitten belongs to another user', async () => {
    // Arrange
    const assignSkillPointsDto = {
      strength: 2,
      agility: 3,
      constitution: 1,
      intelligence: 4,
    };
    
    const kittenId = 'kitten-id';
    const ownerId = 'owner-id';
    const userId = 'another-user-id';
    
    mockKittenRepository.findById = vi.fn().mockResolvedValue({
      id: kittenId,
      name: 'Test Kitten',
      userId: ownerId,
    });

    // Act & Assert
    await expect(assignSkillPointsUseCase.execute(kittenId, assignSkillPointsDto, userId))
      .rejects
      .toThrow('You can only update your own kittens');
    
    expect(mockKittenRepository.findById).toHaveBeenCalledWith(kittenId);
    expect(mockKittenRepository.assignSkillPoints).not.toHaveBeenCalled();
  });

  it('should throw an error if not enough skill points available', async () => {
    // Arrange
    const assignSkillPointsDto = {
      strength: 2,
      agility: 3,
      constitution: 1,
      intelligence: 4,
    };
    
    const kittenId = 'kitten-id';
    const userId = 'user-id';
    
    mockKittenRepository.findById = vi.fn().mockResolvedValue({
      id: kittenId,
      name: 'Test Kitten',
      userId,
      skillPoints: 5, // Only 5 points available, trying to use 10
    });

    // Act & Assert
    await expect(assignSkillPointsUseCase.execute(kittenId, assignSkillPointsDto, userId))
      .rejects
      .toThrow('Not enough skill points available. You have 5 points left.');
    
    expect(mockKittenRepository.findById).toHaveBeenCalledWith(kittenId);
    expect(mockKittenRepository.assignSkillPoints).not.toHaveBeenCalled();
  });

  it('should assign skill points successfully', async () => {
    // Arrange
    const assignSkillPointsDto = {
      strength: 2,
      agility: 3,
      constitution: 1,
      intelligence: 4,
    };
    
    const kittenId = 'kitten-id';
    const userId = 'user-id';
    
    const kitten = {
      id: kittenId,
      name: 'Test Kitten',
      userId,
      strength: 5,
      agility: 5,
      constitution: 5,
      intelligence: 5,
      skillPoints: 10,
    };
    
    mockKittenRepository.findById = vi.fn().mockResolvedValue(kitten);
    
    const updatedKitten = {
      ...kitten,
      strength: 7,
      agility: 8,
      constitution: 6,
      intelligence: 9,
      skillPoints: 0,
    };
    
    mockKittenRepository.assignSkillPoints = vi.fn().mockResolvedValue(updatedKitten);

    // Act
    const result = await assignSkillPointsUseCase.execute(kittenId, assignSkillPointsDto, userId);

    // Assert
    expect(mockKittenRepository.findById).toHaveBeenCalledWith(kittenId);
    expect(mockKittenRepository.assignSkillPoints).toHaveBeenCalledWith(
      kittenId,
      assignSkillPointsDto
    );
    
    expect(result).toEqual(updatedKitten);
  });
});
