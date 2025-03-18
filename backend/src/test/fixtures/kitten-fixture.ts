import { Kitten, User } from '@prisma/client';
import { InMemoryKittenRepository } from '@/test/repositories/in-memory-kitten-repository';
import { InMemoryUserRepository } from '@/test/repositories/in-memory-user-repository';
import { kittenBuilder } from '@/test/builders';
import { CreateKittenDto } from '@/kittens/dto/create-kitten.dto';
import { UpdateKittenDto } from '@/kittens/dto/update-kitten.dto';
import { AssignSkillPointsDto } from '@/kittens/dto/assign-skill-points.dto';

export class KittenFixture {
  private readonly kittenRepository = new InMemoryKittenRepository();
  private readonly userRepository = new InMemoryUserRepository();
  private error: Error | null = null;
  private result: any = null;
  private date: Date = new Date();

  givenKittenExists(kittens: Kitten[]): void {
    this.kittenRepository.givenExists(kittens);
  }

  givenUserExists(users: User[]): void {
    this.userRepository.givenExists(users);
  }

  givenCurrentDate(date: Date): void {
    this.date = date;
  }

  async whenCreateKitten(createKittenDto: CreateKittenDto, userId: string): Promise<void> {
    try {
      // In a real implementation, we'd use a service here
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new Error(`User with ID ${userId} not found`);
      }

      // Check if kitten name already exists
      const existingKitten = await this.kittenRepository.findByName(createKittenDto.name);
      if (existingKitten) {
        throw new Error(`Kitten with name ${createKittenDto.name} already exists`);
      }

      // Create kitten
      const kitten = kittenBuilder({
        name: createKittenDto.name,
        strength: createKittenDto.strength || 5,
        agility: createKittenDto.agility || 5,
        constitution: createKittenDto.constitution || 5,
        intelligence: createKittenDto.intelligence || 5,
        avatarUrl: createKittenDto.avatarUrl || null,
        userId,
        createdAt: this.date,
        updatedAt: this.date,
      }).build();

      this.result = await this.kittenRepository.save(kitten);
    } catch (error) {
      this.error = error as Error;
    }
  }

  async whenFindKittenById(id: string): Promise<void> {
    try {
      this.result = await this.kittenRepository.findById(id);
      if (!this.result) {
        throw new Error(`Kitten with ID ${id} not found`);
      }
    } catch (error) {
      this.error = error as Error;
    }
  }

  async whenUpdateKitten(id: string, updateKittenDto: UpdateKittenDto, userId: string): Promise<void> {
    try {
      const kitten = await this.kittenRepository.findById(id);
      if (!kitten) {
        throw new Error(`Kitten with ID ${id} not found`);
      }

      if (kitten.userId !== userId) {
        throw new Error('You can only update your own kittens');
      }

      const updatedKitten = {
        ...kitten,
        ...updateKittenDto,
        updatedAt: this.date,
      };

      this.result = await this.kittenRepository.save(updatedKitten);
    } catch (error) {
      this.error = error as Error;
    }
  }

  async whenAssignSkillPoints(id: string, dto: AssignSkillPointsDto, userId: string): Promise<void> {
    try {
      const kitten = await this.kittenRepository.findById(id);
      if (!kitten) {
        throw new Error(`Kitten with ID ${id} not found`);
      }

      if (kitten.userId !== userId) {
        throw new Error('You can only update your own kittens');
      }

      // Calculate total points to assign
      const totalPoints = dto.strength + dto.agility + dto.constitution + dto.intelligence;

      // Check if kitten has enough skill points
      if (totalPoints > kitten.skillPoints) {
        throw new Error(`Not enough skill points available. You have ${kitten.skillPoints} points left.`);
      }

      // Update kitten attributes
      const updatedKitten = {
        ...kitten,
        strength: kitten.strength + dto.strength,
        agility: kitten.agility + dto.agility,
        constitution: kitten.constitution + dto.constitution,
        intelligence: kitten.intelligence + dto.intelligence,
        skillPoints: kitten.skillPoints - totalPoints,
        updatedAt: this.date,
      };

      this.result = await this.kittenRepository.save(updatedKitten);
    } catch (error) {
      this.error = error as Error;
    }
  }

  thenKittenShouldExist(expectedKitten: Kitten): void {
    expect(this.result).toEqual(expectedKitten);
  }

  thenKittenShouldNotBeFound(): void {
    expect(this.result).toBeNull();
  }

  thenAttributeShouldBe(attribute: keyof Kitten, value: any): void {
    expect(this.result[attribute]).toEqual(value);
  }

  thenErrorShouldBe(expectedErrorClass: new () => Error): void {
    expect(this.error).toBeInstanceOf(expectedErrorClass);
  }

  thenErrorMessageShouldContain(text: string): void {
    expect(this.error?.message).toContain(text);
  }

  thenSkillPointsShouldBe(expected: number): void {
    expect(this.result.skillPoints).toBe(expected);
  }

  getRepository(): InMemoryKittenRepository {
    return this.kittenRepository;
  }

  getUserRepository(): InMemoryUserRepository {
    return this.userRepository;
  }
}

export const createKittenFixture = (): KittenFixture => {
  return new KittenFixture();
};
