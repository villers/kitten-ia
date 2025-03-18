import { Module } from '@nestjs/common';
import { AbilitiesController } from '@/abilities/abilities.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { CreateAbilityUseCase } from '@/abilities/application/usecases/create-ability.usecase';
import { FindAbilityByIdUseCase } from '@/abilities/application/usecases/find-ability-by-id.usecase';
import { FindAllAbilitiesUseCase } from '@/abilities/application/usecases/find-all-abilities.usecase';
import { UpdateAbilityUseCase } from '@/abilities/application/usecases/update-ability.usecase';
import { DeleteAbilityUseCase } from '@/abilities/application/usecases/delete-ability.usecase';
import { PrismaAbilityRepository } from '@/abilities/infrastructure/prisma-ability.repository';
import { PrismaKittenRepository } from '@/abilities/infrastructure/prisma-kitten.repository';
import { ABILITY_REPOSITORY } from '@/abilities/tokens/tokens';
import {KITTEN_REPOSITORY} from "@/kittens/tokens/tokens";

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
