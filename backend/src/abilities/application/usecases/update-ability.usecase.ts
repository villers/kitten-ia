import { Inject } from '@nestjs/common';
import { AbilityType } from '@prisma/client';
import { AbilityRepository } from '@/abilities/application/ability.repository';
import { KittenRepository } from '@/abilities/application/kitten.repository';
import { Ability } from '@/abilities/domain/ability';
import { AbilityNotFoundError, NotKittenOwnerError } from '@/abilities/domain/errors';
import { ABILITY_REPOSITORY } from '@/abilities/tokens/tokens';
import {KITTEN_REPOSITORY} from "@/kittens/tokens/tokens";

export interface UpdateAbilityCommand {
  id: string;
  userId: string;
  name?: string;
  description?: string;
  type?: AbilityType;
  power?: number;
  accuracy?: number;
  cooldown?: number;
}

export class UpdateAbilityUseCase {
  constructor(
    @Inject(ABILITY_REPOSITORY)
    private readonly abilityRepository: AbilityRepository,
    @Inject(KITTEN_REPOSITORY)
    private readonly kittenRepository: KittenRepository
  ) {}

  async execute(command: UpdateAbilityCommand): Promise<Ability> {
    // Vérifier si au moins un champ est fourni pour la mise à jour
    if (Object.keys(command).length <= 2) { // id et userId sont toujours présents
      throw new Error('At least one field must be provided for update');
    }

    // Trouver la capacité
    const ability = await this.abilityRepository.findById(command.id);
    if (!ability) {
      throw new AbilityNotFoundError(command.id);
    }

    // Vérifier si l'utilisateur est le propriétaire du chaton
    const isOwner = await this.kittenRepository.isKittenOwnedByUser(
      ability.kittenId,
      command.userId
    );
    
    if (!isOwner) {
      throw new NotKittenOwnerError();
    }

    // Mettre à jour la capacité
    const updatedAbility = ability.update(
      command.name,
      command.description,
      command.type,
      command.power,
      command.accuracy,
      command.cooldown
    );

    // Enregistrer et retourner la capacité mise à jour
    return this.abilityRepository.save(updatedAbility);
  }
}
