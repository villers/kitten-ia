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
} from '@nestjs/common';
import { CreateKittenDto } from './dto/create-kitten.dto';
import { UpdateKittenDto } from './dto/update-kitten.dto';
import { AssignSkillPointsDto } from './dto/assign-skill-points.dto';
import { AssignAbilityDto } from './dto/assign-ability.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateKittenUseCase } from './application/usecases/create-kitten.usecase';
import { AssignSkillPointsUseCase } from './application/usecases/assign-skill-points.usecase';
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
    // Other use cases will be injected here
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
    // This will be implemented with a FindKittensUseCase
    return [];
  }

  @ApiOperation({ summary: 'Get kitten by id' })
  @ApiResponse({ status: 200, description: 'Return the kitten' })
  @ApiResponse({ status: 404, description: 'Kitten not found' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    // This will be implemented with a FindKittenByIdUseCase
    return null;
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
    // This will be implemented with an UpdateKittenUseCase
    return null;
  }

  @ApiOperation({ summary: 'Delete a kitten' })
  @ApiResponse({ status: 200, description: 'Kitten successfully deleted' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @ApiResponse({ status: 404, description: 'Kitten not found' })
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    // This will be implemented with a DeleteKittenUseCase
    return null;
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
    // This will be implemented with an AssignAbilityUseCase
    return null;
  }
}
