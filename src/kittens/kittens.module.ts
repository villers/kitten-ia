import { Module } from '@nestjs/common';
import { KittensController } from '../presentation/controllers/kitten/kittens.controller';
import { PrismaService } from '../infrastructure/services/prisma.service';
import { KittenRepository } from '../infrastructure/repositories/kitten.repository';
import { UserRepository } from '../infrastructure/repositories/user.repository';
import { CreateKittenUseCase } from '../core/application/use-cases/kitten/create-kitten.use-case';
import { GetKittenUseCase } from '../core/application/use-cases/kitten/get-kitten.use-case';
import { AssignSkillPointsUseCase } from '../core/application/use-cases/kitten/assign-skill-points.use-case';
import { KittenMapper } from '../presentation/mappers/kitten.mapper';

@Module({
  controllers: [KittensController],
  providers: [
    // Services
    PrismaService,
    
    // Repositories
    {
      provide: 'IKittenRepository',
      useClass: KittenRepository,
    },
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    
    // Use Cases
    CreateKittenUseCase,
    GetKittenUseCase,
    AssignSkillPointsUseCase,
    
    // Mappers
    KittenMapper,
  ],
  exports: [
    // Export use cases for other modules
    CreateKittenUseCase,
    GetKittenUseCase,
    AssignSkillPointsUseCase,
  ],
})
export class KittensModule {}
