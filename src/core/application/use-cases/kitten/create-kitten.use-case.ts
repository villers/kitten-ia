import { Injectable, Inject } from '@nestjs/common';
import { IKittenRepository } from '../../../domain/repositories/kitten.repository.interface';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { Kitten } from '../../../domain/entities/kitten.entity';
import { UserId } from '../../../domain/value-objects/user-id.value-object';
import { CreateKittenDto } from './dto/create-kitten.dto';

@Injectable()
export class CreateKittenUseCase {
  constructor(
    @Inject('IKittenRepository')
    private readonly kittenRepository: IKittenRepository,
    
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository
  ) {}

  async execute(createKittenDto: CreateKittenDto, userId: string): Promise<Kitten> {
    // Check if user exists
    const userIdObj = new UserId(userId);
    const user = await this.userRepository.findById(userIdObj);
    
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    // Check if kitten name already exists for this user
    const nameExists = await this.kittenRepository.existsByNameAndUserId(
      createKittenDto.name,
      userIdObj
    );

    if (nameExists) {
      throw new Error(`Kitten with name ${createKittenDto.name} already exists`);
    }

    // Create kitten
    const kitten = Kitten.create({
      name: createKittenDto.name,
      userId: userId,
      strength: createKittenDto.strength,
      agility: createKittenDto.agility,
      constitution: createKittenDto.constitution,
      intelligence: createKittenDto.intelligence,
      avatarUrl: createKittenDto.avatarUrl
    });

    // Save kitten
    return this.kittenRepository.save(kitten);
  }
}