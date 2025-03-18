import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { KittenRepository } from '../application/kitten.repository';

@Injectable()
export class PrismaKittenRepository implements KittenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<{ id: string, userId: string } | null> {
    const kitten = await this.prisma.kitten.findUnique({
      where: { id },
      select: { id: true, userId: true }
    });

    return kitten;
  }

  async isKittenOwnedByUser(kittenId: string, userId: string): Promise<boolean> {
    const kitten = await this.findById(kittenId);
    
    if (!kitten) {
      return false;
    }
    
    return kitten.userId === userId;
  }
}
