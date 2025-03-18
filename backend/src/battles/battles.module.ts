import { Module } from '@nestjs/common';
import { BattlesService } from '@/battles/battles.service';
import { BattlesController } from '@/battles/battles.controller';
import { BattleEngineService } from '@/battles/services/battle-engine.service';

@Module({
  controllers: [BattlesController],
  providers: [BattlesService, BattleEngineService],
  exports: [BattlesService],
})
export class BattlesModule {}
