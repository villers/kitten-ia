import { Module } from '@nestjs/common';
import { BattlesController } from '@/battles/battles.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { BattleTokens } from '@/battles/tokens/tokens';
import { BattleEngine } from '@/battles/domain/battle-engine';
import { PrismaBattleRepository } from '@/battles/infrastructure/prisma-battle.repository';
import { CreateBattleUseCase } from '@/battles/application/usecases/create-battle.usecase';
import { FindBattleByIdUseCase } from '@/battles/application/usecases/find-battle-by-id.usecase';
import { FindAllBattlesUseCase } from '@/battles/application/usecases/find-all-battles.usecase';
import { KittensModule } from '@/kittens/kittens.module';

@Module({
  imports: [PrismaModule, KittensModule],
  controllers: [BattlesController],
  providers: [
    // Use cases
    CreateBattleUseCase,
    FindBattleByIdUseCase,
    FindAllBattlesUseCase,
    
    // Domain services
    {
      provide: BattleTokens.BattleEngine,
      useClass: BattleEngine,
    },
    
    // Repositories
    {
      provide: BattleTokens.BattleRepository,
      useClass: PrismaBattleRepository,
    }
  ],
  exports: [
    CreateBattleUseCase,
    FindBattleByIdUseCase,
    FindAllBattlesUseCase,
  ],
})
export class BattlesModule {}