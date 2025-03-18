import { Inject } from '@nestjs/common';
import { AbilityRepository } from '../ability.repository';
import { KittenRepository } from '../kitten.repository';
import { AbilityNotFoundError, NotKittenOwnerError } from '../../domain/errors';
import { ABILITY_REPOSITORY, KITTEN_REPOSITORY } from '../../tokens/tokens';

export interface DeleteAbilityCommand {
  id: string;
  userId: string;
}

export class DeleteAbilityUseCase {
  constructor(
    @Inject(ABILITY_REPOSITORY)
    private readonly abilityRepository: AbilityRepository,
    @Inject(KITTEN_REPOSITORY)
    private readonly kittenRepository: KittenRepository
  ) {}

  async execute(command: DeleteAbilityCommand): Promise<void> {
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

    // Supprimer la capacité
    await this.abilityRepository.delete(command.id);
  }
}
