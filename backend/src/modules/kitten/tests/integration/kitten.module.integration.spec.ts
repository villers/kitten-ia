import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { JwtAuthGuard } from '../../../../auth/guards/jwt-auth.guard';
import { KittenModule } from '../../kitten.module';
import { CreateKittenDto } from '../../presentation/dtos/create-kitten.dto';
import { AssignSkillPointsDto } from '../../presentation/dtos/assign-skill-points.dto';

// Mock pour le JwtAuthGuard
class MockJwtAuthGuard {
  canActivate() {
    return true;
  }
}

// Mock pour les repositories
const mockKittenRepository = {
  findById: jest.fn(),
  findByUserId: jest.fn(),
  findByName: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
  updateExperience: jest.fn(),
  levelUp: jest.fn(),
  assignSkillPoints: jest.fn(),
};

const mockUserRepository = {
  findById: jest.fn(),
};

const mockKittenStatsRepository = {
  createForKitten: jest.fn(),
};

describe('KittenModule Integration Tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [KittenModule],
    })
      .overrideGuard(JwtAuthGuard)
      .useClass(MockJwtAuthGuard)
      .overrideProvider('KittenRepository')
      .useValue(mockKittenRepository)
      .overrideProvider('UserRepository')
      .useValue(mockUserRepository)
      .overrideProvider('KittenStatsRepository')
      .useValue(mockKittenStatsRepository)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();

    // Mock pour accéder à l'ID de l'utilisateur dans la requête
    app.use((req, res, next) => {
      req.user = { id: 'test-user-id' };
      next();
    });
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('POST /kittens', () => {
    it('should create a new kitten', async () => {
      // Arrange
      const createKittenDto: CreateKittenDto = {
        name: 'Test Kitten',
        strength: 7,
        agility: 8,
        constitution: 6,
        intelligence: 5,
      };
      
      const expectedKitten = {
        id: 'test-kitten-id',
        ...createKittenDto,
        level: 1,
        experience: 0,
        skillPoints: 0,
        userId: 'test-user-id',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        stats: {
          id: 'test-stats-id',
          kittenId: 'test-kitten-id',
          wins: 0,
          losses: 0,
          draws: 0,
        },
      };
      
      mockUserRepository.findById.mockResolvedValue({
        id: 'test-user-id',
        username: 'testuser',
      });
      
      mockKittenRepository.findByName.mockResolvedValue(null);
      mockKittenRepository.save.mockResolvedValue({
        id: 'test-kitten-id',
        ...createKittenDto,
        level: 1,
        experience: 0,
        skillPoints: 0,
        userId: 'test-user-id',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      mockKittenStatsRepository.createForKitten.mockResolvedValue({
        id: 'test-stats-id',
        kittenId: 'test-kitten-id',
        wins: 0,
        losses: 0,
        draws: 0,
      });
      
      mockKittenRepository.findById.mockResolvedValue(expectedKitten);

      // Act
      const response = await request(app.getHttpServer())
        .post('/kittens')
        .send(createKittenDto)
        .expect(201);

      // Assert
      expect(mockUserRepository.findById).toHaveBeenCalledWith('test-user-id');
      expect(mockKittenRepository.findByName).toHaveBeenCalledWith('Test Kitten');
      expect(mockKittenRepository.save).toHaveBeenCalled();
      expect(mockKittenStatsRepository.createForKitten).toHaveBeenCalled();
      expect(response.body).toEqual(expectedKitten);
    });
  });

  describe('PUT /kittens/:id/assign-skill-points', () => {
    it('should assign skill points to a kitten', async () => {
      // Arrange
      const kittenId = 'test-kitten-id';
      const assignSkillPointsDto: AssignSkillPointsDto = {
        strength: 2,
        agility: 3,
        constitution: 1,
        intelligence: 4,
      };
      
      const kitten = {
        id: kittenId,
        name: 'Test Kitten',
        level: 5,
        experience: 50,
        strength: 10,
        agility: 10,
        constitution: 10,
        intelligence: 10,
        skillPoints: 15,
        userId: 'test-user-id',
      };
      
      const updatedKitten = {
        ...kitten,
        strength: 12,
        agility: 13,
        constitution: 11,
        intelligence: 14,
        skillPoints: 5,
      };
      
      mockKittenRepository.findById.mockResolvedValue(kitten);
      mockKittenRepository.assignSkillPoints.mockResolvedValue(updatedKitten);

      // Act
      const response = await request(app.getHttpServer())
        .put(`/kittens/${kittenId}/assign-skill-points`)
        .send(assignSkillPointsDto)
        .expect(200);

      // Assert
      expect(mockKittenRepository.findById).toHaveBeenCalledWith(kittenId);
      expect(mockKittenRepository.assignSkillPoints).toHaveBeenCalledWith(
        kittenId,
        assignSkillPointsDto
      );
      expect(response.body).toEqual(updatedKitten);
    });
  });
});
