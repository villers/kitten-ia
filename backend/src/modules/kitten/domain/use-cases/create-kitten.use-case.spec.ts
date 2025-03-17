import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CreateKittenUseCase } from './create-kitten.use-case';
import { KittenRepository } from '../repositories/kitten-repository.interface';
import { UserRepository } from '../../../../shared/domain/repositories/user-repository.interface';
import { KittenStatsRepository } from '../repositories/kitten-stats-repository.interface';

describe('CreateKittenUseCase', () => {
  let createKittenUseCase: CreateKittenUseCase;
  let mockKittenRepository: KittenRepository;
  let mockUserRepository: UserRepository;
  let mockKittenStatsRepository: KittenStatsRepository;

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

    mockUserRepository = {
      findById: vi.fn(),
    };

    mockKittenStatsRepository = {
      createForKitten: vi.fn(),
    };

    createKittenUseCase = new CreateKittenUseCase(
      mockKittenRepository,
      mockUserRepository,
      mockKittenStatsRepository
    );
  });

  it('should throw an error if user does not exist', async () => {
    // Arrange
    const createKittenDto = {
      name: 'Test Kitten',
      strength: 5,
      agility: 5,
      constitution: 5,
      intelligence: 5,
    };
    
    const userId = 'non-existent-user-id';
    
    mockUserRepository.findById = vi.fn().mockResolvedValue(null);

    // Act & Assert
    await expect(createKittenUseCase.execute(createKittenDto, userId))
      .rejects
      .toThrow('User with ID non-existent-user-id not found');
    
    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    expect(mockKittenRepository.save).not.toHaveBeenCalled();
    expect(mockKittenStatsRepository.createForKitten).not.toHaveBeenCalled();
  });

  it('should throw an error if kitten name already exists for the user', async () => {
    // Arrange
    const createKittenDto = {
      name: 'Existing Kitten',
      strength: 5,
      agility: 5,
      constitution: 5,
      intelligence: 5,
    };
    
    const userId = 'user-id';
    
    mockUserRepository.findById = vi.fn().mockResolvedValue({
      id: userId,
      username: 'testuser',
    });
    
    mockKittenRepository.findByName = vi.fn().mockResolvedValue({
      id: 'existing-kitten-id',
      name: 'Existing Kitten',
      userId,
    });

    // Act & Assert
    await expect(createKittenUseCase.execute(createKittenDto, userId))
      .rejects
      .toThrow('Kitten with name Existing Kitten already exists');
    
    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    expect(mockKittenRepository.findByName).toHaveBeenCalledWith('Existing Kitten');
    expect(mockKittenRepository.save).not.toHaveBeenCalled();
    expect(mockKittenStatsRepository.createForKitten).not.toHaveBeenCalled();
  });

  it('should create a kitten successfully', async () => {
    // Arrange
    const createKittenDto = {
      name: 'New Kitten',
      strength: 7,
      agility: 6,
      constitution: 8,
      intelligence: 5,
    };
    
    const userId = 'user-id';
    const kittenId = 'new-kitten-id';
    
    mockUserRepository.findById = vi.fn().mockResolvedValue({
      id: userId,
      username: 'testuser',
    });
    
    mockKittenRepository.findByName = vi.fn().mockResolvedValue(null);
    
    const savedKitten = {
      id: kittenId,
      name: createKittenDto.name,
      level: 1,
      experience: 0,
      strength: createKittenDto.strength,
      agility: createKittenDto.agility,
      constitution: createKittenDto.constitution,
      intelligence: createKittenDto.intelligence,
      skillPoints: 0,
      avatarUrl: null,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    mockKittenRepository.save = vi.fn().mockResolvedValue(savedKitten);
    
    const createdStats = {
      id: 'stats-id',
      kittenId,
      wins: 0,
      losses: 0,
      draws: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    mockKittenStatsRepository.createForKitten = vi.fn().mockResolvedValue(createdStats);
    
    mockKittenRepository.findById = vi.fn().mockResolvedValue({
      ...savedKitten,
      stats: createdStats,
    });

    // Act
    const result = await createKittenUseCase.execute(createKittenDto, userId);

    // Assert
    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    expect(mockKittenRepository.findByName).toHaveBeenCalledWith(createKittenDto.name);
    expect(mockKittenRepository.save).toHaveBeenCalled();
    expect(mockKittenStatsRepository.createForKitten).toHaveBeenCalledWith(kittenId);
    expect(mockKittenRepository.findById).toHaveBeenCalledWith(kittenId);
    
    expect(result).toEqual({
      ...savedKitten,
      stats: createdStats,
    });
  });
});
