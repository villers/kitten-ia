import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') {
      return;
    }
    
    // Transaction pour supprimer les données en respectant les contraintes de clés étrangères
    const modelNames = Reflect.ownKeys(this).filter(
      (key) => 
        typeof key === 'string' && 
        !key.startsWith('_') && 
        !key.startsWith('$') &&
        typeof this[key] === 'object' &&
        this[key] !== null &&
        'deleteMany' in this[key]
    );

    return this.$transaction(
      modelNames.map((modelName: string) => this[modelName].deleteMany())
    );
  }
}
