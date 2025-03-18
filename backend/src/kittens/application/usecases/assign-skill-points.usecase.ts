import { KittenRepository } from '../kitten.repository';
import { Kitten } from '../../domain/kitten';
import { KittenNotFoundError, NotKittenOwnerError } from '../../domain/errors';

export interface AssignSkillPointsCommand {
  kittenId: string;
  userId: string;
  strength: number;
  agility: number;
  constitution: number;
  intelligence: number;
}

export class AssignSkillPointsUseCase {
  constructor(private readonly kittenRepository: KittenRepository) {}

  async execute(command: AssignSkillPointsCommand): Promise<Kitten> {
    // Find kitten
    const kitten = await this.kittenRepository.findById(command.kittenId);
    if (!kitten) {
      throw new KittenNotFoundError(command.kittenId);
    }

    // Check if user is the owner
    if (!kitten.isOwnedBy(command.userId)) {
      throw new NotKittenOwnerError();
    }

    // Assign skill points
    const updatedKitten = kitten.assignSkillPoints(
      command.strength,
      command.agility,
      command.constitution,
      command.intelligence
    );

    // Save and return updated kitten
    return this.kittenRepository.save(updatedKitten);
  }
}
