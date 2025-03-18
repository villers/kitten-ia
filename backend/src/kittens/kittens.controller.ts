import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { CreateKittenDto } from '@/kittens/dto/create-kitten.dto';
import { UpdateKittenDto } from '@/kittens/dto/update-kitten.dto';
import { AssignSkillPointsDto } from '@/kittens/dto/assign-skill-points.dto';
import { AssignAbilityDto } from '@/kittens/dto/assign-ability.dto';
import { AddExperienceDto } from '@/kittens/dto/add-experience.dto';
import { LevelUpDto } from '@/kittens/dto/level-up.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateKittenUseCase } from '@/kittens/application/usecases/create-kitten.usecase';
import { AssignSkillPointsUseCase } from '@/kittens/application/usecases/assign-skill-points.usecase';
import { UpdateKittenUseCase } from '@/kittens/application/usecases/update-kitten.usecase';
import { AddExperienceUseCase } from '@/kittens/application/usecases/add-experience.usecase';
import { LevelUpUseCase } from '@/kittens/application/usecases/level-up.usecase';
import { KittenRepository } from './application/kitten.repository';
import { KITTEN_REPOSITORY } from './tokens/tokens';
import { 
  KittenNameAlreadyExistError, 
  KittenNotFoundError, 
  NotEnoughSkillPointsError, 
  NotKittenOwnerError, 
  UserNotFoundForKittenCreationError 
} from './domain/errors';

@ApiTags('kittens')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('kittens')
export class KittensController {
  constructor(
    private readonly createKittenUseCase: CreateKittenUseCase,
    private readonly assignSkillPointsUseCase: AssignSkillPointsUseCase,
    private readonly updateKittenUseCase: UpdateKittenUseCase,
    private readonly addExperienceUseCase: AddExperienceUseCase,
    private readonly levelUpUseCase: LevelUpUseCase,
    @Inject(KITTEN_REPOSITORY)
    private readonly kittenRepository: KittenRepository
  ) {}

  @ApiOperation({ summary: 'Create a new kitten' })
  @ApiResponse({ status: 201, description: 'Kitten successfully created' })
  @Post()
  async create(@Body() createKittenDto: CreateKittenDto, @Request() req) {
    try {
      const kitten = await this.createKittenUseCase.execute({
        ...createKittenDto,
        userId: req.user.userId,
      });
      return kitten.toJSON();
    } catch (error) {
      if (error instanceof UserNotFoundForKittenCreationError) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof KittenNameAlreadyExistError) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @ApiOperation({ summary: 'Get all kittens for the current user' })
  @ApiResponse({ status: 200, description: 'Return all kittens' })
  @Get()
  async findAll(@Request() req) {
    try {
      const kittens = await this.kittenRepository.findByUserId(req.user.userId);
      return kittens.map(kitten => kitten.toJSON());
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Get kitten by id' })
  @ApiResponse({ status: 200, description: 'Return the kitten' })
  @ApiResponse({ status: 404, description: 'Kitten not found' })
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    try {
      const kitten = await this.kittenRepository.findById(id);
      
      if (!kitten) {
        throw new KittenNotFoundError(id);
      }
      
      return kitten.toJSON();
    } catch (error) {
      if (error instanceof KittenNotFoundError) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @ApiOperation({ summary: 'Update a kitten' })
  @ApiResponse({ status: 200, description: 'Kitten successfully updated' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @ApiResponse({ status: 404, description: 'Kitten not found' })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateKittenDto: UpdateKittenDto,
    @Request() req,
  ) {
    try {
      const kitten = await this.updateKittenUseCase.execute({
        kittenId: id,
        userId: req.user.userId,
        name: updateKittenDto.name,
        avatarUrl: updateKittenDto.avatarUrl,
      });
      return kitten.toJSON();
    } catch (error) {
      if (error instanceof KittenNotFoundError) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof NotKittenOwnerError) {
        throw new ForbiddenException(error.message);
      }
      throw error;
    }
  }

  @ApiOperation({ summary: 'Delete a kitten' })
  @ApiResponse({ status: 200, description: 'Kitten successfully deleted' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @ApiResponse({ status: 404, description: 'Kitten not found' })
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    try {
      const kitten = await this.kittenRepository.findById(id);
      
      if (!kitten) {
        throw new KittenNotFoundError(id);
      }
      
      if (!kitten.isOwnedBy(req.user.userId)) {
        throw new NotKittenOwnerError();
      }
      
      await this.kittenRepository.delete(id);
      return { message: 'Kitten successfully deleted' };
    } catch (error) {
      if (error instanceof KittenNotFoundError) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof NotKittenOwnerError) {
        throw new ForbiddenException(error.message);
      }
      throw error;
    }
  }

  @ApiOperation({ summary: 'Assign skill points to kitten attributes' })
  @ApiResponse({ status: 200, description: 'Skill points successfully assigned' })
  @ApiResponse({ status: 400, description: 'Not enough skill points' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @ApiResponse({ status: 404, description: 'Kitten not found' })
  @Patch(':id/skills')
  async assignSkillPoints(
    @Param('id') id: string,
    @Body() assignSkillPointsDto: AssignSkillPointsDto,
    @Request() req,
  ) {
    try {
      const kitten = await this.assignSkillPointsUseCase.execute({
        kittenId: id,
        userId: req.user.userId,
        ...assignSkillPointsDto,
      });
      return kitten.toJSON();
    } catch (error) {
      if (error instanceof KittenNotFoundError) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof NotKittenOwnerError) {
        throw new ForbiddenException(error.message);
      }
      if (error instanceof NotEnoughSkillPointsError) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @ApiOperation({ summary: 'Add experience to a kitten' })
  @ApiResponse({ status: 200, description: 'Experience successfully added' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @ApiResponse({ status: 404, description: 'Kitten not found' })
  @Patch(':id/experience')
  async addExperience(
    @Param('id') id: string,
    @Body() addExperienceDto: AddExperienceDto,
    @Request() req,
  ) {
    try {
      const kitten = await this.addExperienceUseCase.execute({
        kittenId: id,
        userId: req.user.userId,
        experience: addExperienceDto.experience,
      });
      return kitten.toJSON();
    } catch (error) {
      if (error instanceof KittenNotFoundError) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof NotKittenOwnerError) {
        throw new ForbiddenException(error.message);
      }
      throw error;
    }
  }

  @ApiOperation({ summary: 'Level up a kitten' })
  @ApiResponse({ status: 200, description: 'Kitten successfully leveled up' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @ApiResponse({ status: 404, description: 'Kitten not found' })
  @Patch(':id/level-up')
  async levelUp(
    @Param('id') id: string,
    @Body() levelUpDto: LevelUpDto,
    @Request() req,
  ) {
    try {
      const kitten = await this.levelUpUseCase.execute({
        kittenId: id,
        userId: req.user.userId,
        skillPointsPerLevel: levelUpDto.skillPointsPerLevel,
      });
      return kitten.toJSON();
    } catch (error) {
      if (error instanceof KittenNotFoundError) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof NotKittenOwnerError) {
        throw new ForbiddenException(error.message);
      }
      throw error;
    }
  }

  @ApiOperation({ summary: 'Assign ability to kitten' })
  @ApiResponse({ status: 200, description: 'Ability successfully assigned' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @ApiResponse({ status: 404, description: 'Kitten or ability not found' })
  @Patch(':id/abilities')
  async assignAbility(
    @Param('id') id: string,
    @Body() assignAbilityDto: AssignAbilityDto,
    @Request() req,
  ) {
    // Cette fonctionnalité n'est pas encore implémentée
    // Nous retournons une réponse temporaire pour que le frontend continue de fonctionner
    try {
      const kitten = await this.kittenRepository.findById(id);
      
      if (!kitten) {
        throw new KittenNotFoundError(id);
      }
      
      if (!kitten.isOwnedBy(req.user.userId)) {
        throw new NotKittenOwnerError();
      }
      
      // Retourner le kitten inchangé pour le moment
      return kitten.toJSON();
    } catch (error) {
      if (error instanceof KittenNotFoundError) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof NotKittenOwnerError) {
        throw new ForbiddenException(error.message);
      }
      throw error;
    }
  }
}
