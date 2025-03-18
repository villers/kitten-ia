import { KittenRepository } from '../kitten.repository';
import { UserRepository } from '../user.repository';
import { Inject } from '@nestjs/common';
import { Kitten } from '@/kittens/domain/kitten';
import { KittenName } from '@/kittens/domain/kitten-name';
import { KittenAttributes } from '@/kittens/domain/kitten-attributes';
import { AttributeValue } from '@/kittens/domain/attribute-value';
import { KittenNameAlreadyExistError, UserNotFoundForKittenCreationError } from '@/kittens/domain/errors';
import { randomUUID } from 'crypto';
import {KITTEN_REPOSITORY} from "@/kittens/tokens/tokens";
import {USER_REPOSITORY} from "@/users/tokens/tokens";

export interface CreateKittenCommand {
  name: string;
  userId: string;
  strength?: number;
  agility?: number;
  constitution?: number;
  intelligence?: number;
  avatarUrl?: string;
}

export class CreateKittenUseCase {
  private dateProvider: () => Date;

  constructor(
    @Inject(KITTEN_REPOSITORY)
    private readonly kittenRepository: KittenRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository
  ) {
    this.dateProvider = () => new Date();
  }

  setDateProvider(dateProvider: () => Date): void {
    this.dateProvider = dateProvider;
  }

  async execute(command: CreateKittenCommand): Promise<Kitten> {
    // Check if user exists
    const user = await this.userRepository.findById(command.userId);
    if (!user) {
      throw new UserNotFoundForKittenCreationError(command.userId);
    }

    // Check if kitten name already exists for this user
    const existingKitten = await this.kittenRepository.findByName(command.name);
    if (existingKitten && existingKitten.userId === command.userId) {
      throw new KittenNameAlreadyExistError(command.name);
    }

    // Create attributes
    const strength = command.strength ? AttributeValue.of(command.strength) : AttributeValue.of(5);
    const agility = command.agility ? AttributeValue.of(command.agility) : AttributeValue.of(5);
    const constitution = command.constitution ? AttributeValue.of(command.constitution) : AttributeValue.of(5);
    const intelligence = command.intelligence ? AttributeValue.of(command.intelligence) : AttributeValue.of(5);
    
    const attributes = new KittenAttributes(
      strength,
      agility,
      constitution,
      intelligence
    );

    // Create kitten
    const now = this.dateProvider();
    const kitten = new Kitten(
      randomUUID(),
      KittenName.of(command.name),
      command.userId,
      1,              // Initial level
      0,              // Initial experience
      0,              // Initial skill points
      attributes,
      now,
      now,
      command.avatarUrl
    );

    // Save and return kitten
    return this.kittenRepository.save(kitten);
  }
}
