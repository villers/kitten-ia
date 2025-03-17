import { KittenRepository } from '../repositories/kitten-repository.interface';
import { UserRepository } from '../../../../shared/domain/repositories/user-repository.interface';
import { KittenStatsRepository } from '../repositories/kitten-stats-repository.interface';

interface CreateKittenDto {
  name: string;
  strength?: number;
  agility?: number;
  constitution?: number;
  intelligence?: number;
  avatarUrl?: string;
}

export class CreateKittenUseCase {
  constructor(
    private readonly kittenRepository: KittenRepository,
    private readonly userRepository: UserRepository,
    private readonly kittenStatsRepository: KittenStatsRepository,
  ) {}

  async execute(createKittenDto: CreateKittenDto, userId: string) {
    // Vérifier si l'utilisateur existe
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    // Vérifier si un chaton avec le même nom existe déjà
    const existingKitten = await this.kittenRepository.findByName(createKittenDto.name);
    if (existingKitten) {
      throw new Error(`Kitten with name ${createKittenDto.name} already exists`);
    }

    // Créer un nouveau chaton
    const kitten = await this.kittenRepository.save({
      id: `kitten-${Date.now()}`, // Temporary ID, will be replaced by the repository
      name: createKittenDto.name,
      level: 1,
      experience: 0,
      strength: createKittenDto.strength || 5,
      agility: createKittenDto.agility || 5,
      constitution: createKittenDto.constitution || 5,
      intelligence: createKittenDto.intelligence || 5,
      skillPoints: 0,
      avatarUrl: createKittenDto.avatarUrl || null,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Créer les statistiques associées
    await this.kittenStatsRepository.createForKitten(kitten.id);

    // Récupérer le chaton avec ses stats
    const kittenWithStats = await this.kittenRepository.findById(kitten.id);
    
    return kittenWithStats;
  }
}
