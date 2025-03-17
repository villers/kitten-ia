import { Module } from '@nestjs/common';
import { BattlesService } from './battles.service';
import { BattlesController } from './battles.controller';
import { BattleEngineService } from './services/battle-engine.service';

@Module({
  controllers: [BattlesController],
  providers: [BattlesService, BattleEngineService],
  exports: [BattlesService],
})
export class BattlesModule {}
