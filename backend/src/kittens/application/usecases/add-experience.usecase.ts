import { KittenRepository } from '../kitten.repository';
import { Kitten } from '../../domain/kitten';
import { KittenNotFoundError, NotKittenOwnerError } from '../../domain/errors';

export interface AddExperienceCommand {
  kittenId: string;
  userId: string;
  experience: number;
}

export class AddExperienceUseCase {
  constructor(private readonly kittenRepository: KittenRepository) {}

  async execute(command: AddExperienceCommand): Promise<Kitten> {
    // Validate experience
    if (command.experience <= 0) {
      throw new Error('Experience must be a positive number');
    }

    // Find kitten
    const kitten = await this.kittenRepository.findById(command.kittenId);
    if (!kitten) {
      throw new KittenNotFoundError(command.kittenId);
    }

    // Check if user is the owner
    if (!kitten.isOwnedBy(command.userId)) {
      throw new NotKittenOwnerError();
    }

    // Add experience
    const updatedKitten = kitten.addExperience(command.experience);

    // Save and return updated kitten
    return this.kittenRepository.save(updatedKitten);
  }
}
