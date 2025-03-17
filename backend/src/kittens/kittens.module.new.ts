import { Module } from '@nestjs/common';
import { KittensController } from './kittens.controller.new';
import { PrismaModule } from '../prisma/prisma.module';
import { CreateKittenUseCase } from './application/usecases/create-kitten.usecase';
import { AssignSkillPointsUseCase } from './application/usecases/assign-skill-points.usecase';
import { PrismaKittenRepository } from './infrastructure/prisma-kitten.repository';
import { PrismaUserRepository } from './infrastructure/prisma-user.repository';
import { KittenRepository } from './application/kitten.repository';
import { UserRepository } from './application/user.repository';

@Module({
  imports: [PrismaModule],
  controllers: [KittensController],
  providers: [
    // Use cases
    CreateKittenUseCase,
    AssignSkillPointsUseCase,
    
    // Repositories
    {
      provide: KittenRepository,
      useClass: PrismaKittenRepository,
    },
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [KittenRepository, UserRepository],
})
export class KittensModule {}
