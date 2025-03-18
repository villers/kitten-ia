import { Inject } from '@nestjs/common';
import { AbilityType } from '@prisma/client';
import { AbilityRepository } from '../ability.repository';
import { KittenRepository } from '../kitten.repository';
import { Ability } from '../../domain/ability';
import { KittenNotFoundError, NotKittenOwnerError } from '../../domain/errors';
import { ABILITY_REPOSITORY, KITTEN_REPOSITORY } from '../../tokens/tokens';
import { randomUUID } from 'crypto';

export interface CreateAbilityCommand {
  name: string;
  description: string;
  type: AbilityType;
  power: number;
  accuracy: number;
  cooldown: number;
  kittenId: string;
  userId: string;
}

export class CreateAbilityUseCase {
  private dateProvider: () => Date;

  constructor(
    @Inject(ABILITY_REPOSITORY)
    private readonly abilityRepository: AbilityRepository,
    @Inject(KITTEN_REPOSITORY)
    private readonly kittenRepository: KittenRepository
  ) {
    this.dateProvider = () => new Date();
  }

  setDateProvider(dateProvider: () => Date): void {
    this.dateProvider = dateProvider;
  }

  async execute(command: CreateAbilityCommand): Promise<Ability> {
    // Vérifier si le chaton existe
    const kitten = await this.kittenRepository.findById(command.kittenId);
    if (!kitten) {
      throw new KittenNotFoundError(command.kittenId);
    }

    // Vérifier si l'utilisateur est le propriétaire du chaton
    if (kitten.userId !== command.userId) {
      throw new NotKittenOwnerError();
    }

    // Créer la capacité
    const now = this.dateProvider();
    const ability = new Ability(
      randomUUID(),
      command.name,
      command.description,
      command.type,
      command.power,
      command.accuracy,
      command.cooldown,
      command.kittenId,
      now,
      now
    );

    // Enregistrer et retourner la capacité
    return this.abilityRepository.save(ability);
  }
}
