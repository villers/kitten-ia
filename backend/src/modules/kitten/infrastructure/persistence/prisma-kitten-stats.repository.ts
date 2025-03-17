import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { KittenStatsRepository, KittenStatsEntity } from '../../domain/repositories/kitten-stats-repository.interface';

@Injectable()
export class PrismaKittenStatsRepository implements KittenStatsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createForKitten(kittenId: string): Promise<KittenStatsEntity> {
    return this.prisma.kittenStats.create({
      data: {
        kittenId,
        wins: 0,
        losses: 0,
        draws: 0,
      },
    });
  }
}
