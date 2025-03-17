import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  Put,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../auth/guards/jwt-auth.guard';
import { CreateKittenUseCase } from '../../domain/use-cases/create-kitten.use-case';
import { AssignSkillPointsUseCase } from '../../domain/use-cases/assign-skill-points.use-case';
import { CreateKittenDto } from '../dtos/create-kitten.dto';
import { AssignSkillPointsDto } from '../dtos/assign-skill-points.dto';
import { KittenRepository } from '../../domain/repositories/kitten-repository.interface';

@ApiTags('kittens')
@Controller('kittens')
export class KittenController {
  constructor(
    private readonly createKittenUseCase: CreateKittenUseCase,
    private readonly assignSkillPointsUseCase: AssignSkillPointsUseCase,
    private readonly kittenRepository: KittenRepository,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un nouveau chaton' })
  @ApiResponse({ status: 201, description: 'Chaton créé avec succès' })
  async create(@Body() createKittenDto: CreateKittenDto, @Req() req) {
    try {
      return await this.createKittenUseCase.execute(createKittenDto, req.user.id);
    } catch (error) {
      if (error.message.includes('User with ID')) {
        throw new NotFoundException(error.message);
      }
      if (error.message.includes('already exists')) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Récupérer tous les chatons de l\'utilisateur connecté' })
  @ApiResponse({ status: 200, description: 'Liste des chatons récupérée avec succès' })
  async findAll(@Req() req) {
    return this.kittenRepository.findByUserId(req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Récupérer un chaton par son ID' })
  @ApiResponse({ status: 200, description: 'Chaton récupéré avec succès' })
  @ApiResponse({ status: 404, description: 'Chaton non trouvé' })
  async findOne(@Param('id') id: string) {
    const kitten = await this.kittenRepository.findById(id);
    if (!kitten) {
      throw new NotFoundException(`Kitten with ID ${id} not found`);
    }
    return kitten;
  }

  @Put(':id/assign-skill-points')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Assigner des points de compétence à un chaton' })
  @ApiResponse({ status: 200, description: 'Points de compétence assignés avec succès' })
  @ApiResponse({ status: 400, description: 'Pas assez de points de compétence disponibles' })
  @ApiResponse({ status: 403, description: 'Vous ne pouvez mettre à jour que vos propres chatons' })
  @ApiResponse({ status: 404, description: 'Chaton non trouvé' })
  async assignSkillPoints(
    @Param('id') id: string,
    @Body() assignSkillPointsDto: AssignSkillPointsDto,
    @Req() req,
  ) {
    try {
      return await this.assignSkillPointsUseCase.execute(id, assignSkillPointsDto, req.user.id);
    } catch (error) {
      if (error.message.includes('Kitten with ID')) {
        throw new NotFoundException(error.message);
      }
      if (error.message.includes('You can only update your own kittens')) {
        throw new ForbiddenException(error.message);
      }
      if (error.message.includes('Not enough skill points available')) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer un chaton' })
  @ApiResponse({ status: 200, description: 'Chaton supprimé avec succès' })
  @ApiResponse({ status: 403, description: 'Vous ne pouvez supprimer que vos propres chatons' })
  @ApiResponse({ status: 404, description: 'Chaton non trouvé' })
  async remove(@Param('id') id: string, @Req() req) {
    const kitten = await this.kittenRepository.findById(id);
    
    if (!kitten) {
      throw new NotFoundException(`Kitten with ID ${id} not found`);
    }
    
    if (kitten.userId !== req.user.id) {
      throw new ForbiddenException('You can only delete your own kittens');
    }
    
    await this.kittenRepository.delete(id);
    return { message: 'Kitten deleted successfully' };
  }
}
