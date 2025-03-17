import { KittenRepository } from '../kitten.repository';
import { Kitten } from '../../domain/kitten';
import { KittenNotFoundError, NotKittenOwnerError } from '../../domain/errors';

export interface LevelUpCommand {
  kittenId: string;
  userId: string;
  skillPointsPerLevel?: number;
}

export class LevelUpUseCase {
  constructor(private readonly kittenRepository: KittenRepository) {}

  async execute(command: LevelUpCommand): Promise<Kitten> {
    // Find kitten
    const kitten = await this.kittenRepository.findById(command.kittenId);
    if (!kitten) {
      throw new KittenNotFoundError(command.kittenId);
    }

    // Check if user is the owner
    if (!kitten.isOwnedBy(command.userId)) {
      throw new NotKittenOwnerError();
    }

    // Level up kitten
    const updatedKitten = kitten.levelUp(command.skillPointsPerLevel);

    // Save and return updated kitten
    return this.kittenRepository.save(updatedKitten);
  }
}
