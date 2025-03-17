import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { KittensModule } from './kittens/kittens.module'; // Ancien module (à remplacer progressivement)
import { BattlesModule } from './battles/battles.module';
import { AbilitiesModule } from './abilities/abilities.module';
import { AuthModule } from './auth/auth.module';
import { KittenModule } from './modules/kitten/kitten.module'; // Nouveau module avec Clean Architecture

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    KittensModule, // Nous gardons temporairement l'ancien module
    KittenModule, // Nouveau module avec Clean Architecture
    BattlesModule,
    AbilitiesModule,
    AuthModule,
  ],
})
export class AppModule {}
