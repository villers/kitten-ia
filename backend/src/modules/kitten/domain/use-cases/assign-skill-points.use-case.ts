import { KittenRepository } from "../repositories/kitten-repository.interface";

interface AssignSkillPointsDto {
  strength: number;
  agility: number;
  constitution: number;
  intelligence: number;
}

export class AssignSkillPointsUseCase {
  constructor(private readonly kittenRepository: KittenRepository) {}

  async execute(kittenId: string, assignSkillPointsDto: AssignSkillPointsDto, userId: string) {
    // Récupérer le chaton
    const kitten = await this.kittenRepository.findById(kittenId);
    if (!kitten) {
      throw new Error(`Kitten with ID ${kittenId} not found`);
    }

    // Vérifier si le chaton appartient à l'utilisateur
    if (kitten.userId !== userId) {
      throw new Error('You can only update your own kittens');
    }

    // Calculer le total des points à assigner
    const totalPoints = 
      assignSkillPointsDto.strength + 
      assignSkillPointsDto.agility + 
      assignSkillPointsDto.constitution + 
      assignSkillPointsDto.intelligence;

    // Vérifier si le chaton a suffisamment de points de compétence disponibles
    if (totalPoints > kitten.skillPoints) {
      throw new Error(`Not enough skill points available. You have ${kitten.skillPoints} points left.`);
    }

    // Appliquer les points
    return this.kittenRepository.assignSkillPoints(kittenId, assignSkillPointsDto);
  }
}
