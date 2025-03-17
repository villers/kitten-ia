import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { IUserRepository } from '../../core/domain/repositories/user.repository.interface';
import { User } from '../../core/domain/entities/user.entity';
import { UserId } from '../../core/domain/value-objects/user-id.value-object';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: UserId): Promise<User | null> {
    const userData = await this.prisma.user.findUnique({
      where: { id: id.value },
    });

    if (!userData) {
      return null;
    }

    return this.mapToDomain(userData);
  }

  async findByUsername(username: string): Promise<User | null> {
    const userData = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!userData) {
      return null;
    }

    return this.mapToDomain(userData);
  }

  async findByEmail(email: string): Promise<User | null> {
    const userData = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!userData) {
      return null;
    }

    return this.mapToDomain(userData);
  }

  async save(user: User): Promise<User> {
    const userData = await this.prisma.user.upsert({
      where: { id: user.id.value },
      update: {
        username: user.username,
        email: user.email,
        password: user.password,
        updatedAt: new Date(),
      },
      create: {
        id: user.id.value,
        username: user.username,
        email: user.email,
        password: user.password,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });

    return this.mapToDomain(userData);
  }

  async delete(id: UserId): Promise<void> {
    await this.prisma.user.delete({
      where: { id: id.value },
    });
  }

  async existsByUsername(username: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    return !!user;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return !!user;
  }

  private mapToDomain(userData: any): User {
    return new User({
      id: new UserId(userData.id),
      username: userData.username,
      email: userData.email,
      password: userData.password,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
    });
  }
}