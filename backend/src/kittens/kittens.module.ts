import { Module } from '@nestjs/common';
import { KittensController } from './kittens.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { CreateKittenUseCase } from '@/kittens/application/usecases/create-kitten.usecase';
import { AssignSkillPointsUseCase } from '@/kittens/application/usecases/assign-skill-points.usecase';
import { UpdateKittenUseCase } from '@/kittens/application/usecases/update-kitten.usecase';
import { AddExperienceUseCase } from '@/kittens/application/usecases/add-experience.usecase';
import { LevelUpUseCase } from '@/kittens/application/usecases/level-up.usecase';
import { PrismaKittenRepository } from '@/kittens/infrastructure/prisma-kitten.repository';
import { PrismaUserRepository } from '@/kittens/infrastructure/prisma-user.repository';
import { KITTEN_REPOSITORY, USER_REPOSITORY } from './tokens/tokens';

@Module({
  imports: [PrismaModule],
  controllers: [KittensController],
  providers: [
    // Use cases
    CreateKittenUseCase,
    AssignSkillPointsUseCase,
    UpdateKittenUseCase,
    AddExperienceUseCase,
    LevelUpUseCase,
    
    // Repositories
    {
      provide: KITTEN_REPOSITORY,
      useClass: PrismaKittenRepository,
    },
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [KITTEN_REPOSITORY, USER_REPOSITORY],
})
export class KittensModule {}
