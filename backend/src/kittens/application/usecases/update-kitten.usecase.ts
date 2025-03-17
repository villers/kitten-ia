import { KittenRepository } from '../kitten.repository';
import { Inject } from '@nestjs/common';
import { KITTEN_REPOSITORY } from '../../tokens/tokens';
import { Kitten } from '../../domain/kitten';
import { KittenNotFoundError, NotKittenOwnerError } from '../../domain/errors';

export interface UpdateKittenCommand {
  kittenId: string;
  userId: string;
  name?: string;
  avatarUrl?: string | null;
}

export class UpdateKittenUseCase {
  constructor(
    @Inject(KITTEN_REPOSITORY)
    private readonly kittenRepository: KittenRepository
  ) {}

  async execute(command: UpdateKittenCommand): Promise<Kitten> {
    // Check if either name or avatarUrl is provided
    if (command.name === undefined && command.avatarUrl === undefined) {
      throw new Error('At least one of name or avatarUrl must be provided');
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

    // Update kitten
    const updatedKitten = kitten.update(command.name, command.avatarUrl);

    // Save and return updated kitten
    return this.kittenRepository.save(updatedKitten);
  }
}
