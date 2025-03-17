import { Module } from '@nestjs/common';
import { KittenController } from './presentation/controllers/kitten.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { PrismaKittenRepository } from './infrastructure/persistence/prisma-kitten.repository';
import { PrismaKittenStatsRepository } from './infrastructure/persistence/prisma-kitten-stats.repository';
import { PrismaUserRepository } from '../../shared/infrastructure/persistence/prisma-user.repository';
import { CreateKittenUseCase } from './domain/use-cases/create-kitten.use-case';
import { AssignSkillPointsUseCase } from './domain/use-cases/assign-skill-points.use-case';

@Module({
  imports: [PrismaModule],
  controllers: [KittenController],
  providers: [
    // Repositories
    {
      provide: 'KittenRepository',
      useClass: PrismaKittenRepository,
    },
    {
      provide: 'KittenStatsRepository',
      useClass: PrismaKittenStatsRepository,
    },
    {
      provide: 'UserRepository',
      useClass: PrismaUserRepository,
    },
    
    // Use cases
    {
      provide: CreateKittenUseCase,
      useFactory: (kittenRepo, userRepo, statsRepo) => {
        return new CreateKittenUseCase(kittenRepo, userRepo, statsRepo);
      },
      inject: ['KittenRepository', 'UserRepository', 'KittenStatsRepository'],
    },
    {
      provide: AssignSkillPointsUseCase,
      useFactory: (kittenRepo) => {
        return new AssignSkillPointsUseCase(kittenRepo);
      },
      inject: ['KittenRepository'],
    },
  ],
  exports: ['KittenRepository'],
})
export class KittenModule {}
