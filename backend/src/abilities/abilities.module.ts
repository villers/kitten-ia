import { Module } from '@nestjs/common';
import { AbilitiesController } from './abilities.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CreateAbilityUseCase } from './application/usecases/create-ability.usecase';
import { FindAbilityByIdUseCase } from './application/usecases/find-ability-by-id.usecase';
import { FindAllAbilitiesUseCase } from './application/usecases/find-all-abilities.usecase';
import { UpdateAbilityUseCase } from './application/usecases/update-ability.usecase';
import { DeleteAbilityUseCase } from './application/usecases/delete-ability.usecase';
import { PrismaAbilityRepository } from './infrastructure/prisma-ability.repository';
import { PrismaKittenRepository } from './infrastructure/prisma-kitten.repository';
import { ABILITY_REPOSITORY, KITTEN_REPOSITORY } from './tokens/tokens';

@Module({
  imports: [PrismaModule],
  controllers: [AbilitiesController],
  providers: [
    // Cas d'utilisation
    CreateAbilityUseCase,
    FindAbilityByIdUseCase,
    FindAllAbilitiesUseCase,
    UpdateAbilityUseCase,
    DeleteAbilityUseCase,
    
    // Repositories
    {
      provide: ABILITY_REPOSITORY,
      useClass: PrismaAbilityRepository,
    },
    {
      provide: KITTEN_REPOSITORY,
      useClass: PrismaKittenRepository,
    },
  ],
})
export class AbilitiesModule {}
