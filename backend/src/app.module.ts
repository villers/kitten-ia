import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { KittensModule } from './kittens/kittens.module';
import { BattlesModule } from './battles/battles.module';
import { AbilitiesModule } from './abilities/abilities.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    KittensModule,
    BattlesModule,
    AbilitiesModule,
    AuthModule,
  ],
})
export class AppModule {}
