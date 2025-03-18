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
  Query,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { CreateAbilityDto } from './dto/create-ability.dto';
import { UpdateAbilityDto } from './dto/update-ability.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

import { CreateAbilityUseCase } from './application/usecases/create-ability.usecase';
import { FindAbilityByIdUseCase } from './application/usecases/find-ability-by-id.usecase';
import { FindAllAbilitiesUseCase } from './application/usecases/find-all-abilities.usecase';
import { UpdateAbilityUseCase } from './application/usecases/update-ability.usecase';
import { DeleteAbilityUseCase } from './application/usecases/delete-ability.usecase';

import { 
  AbilityNotFoundError, 
  KittenNotFoundError, 
  NotKittenOwnerError,
  AbilityNameTooShortError,
  AbilityNameTooLongError,
  InvalidPowerValueError,
  InvalidAccuracyValueError,
  InvalidCooldownValueError
} from './domain/errors';

@ApiTags('abilities')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('abilities')
export class AbilitiesController {
  constructor(
    private readonly createAbilityUseCase: CreateAbilityUseCase,
    private readonly findAbilityByIdUseCase: FindAbilityByIdUseCase,
    private readonly findAllAbilitiesUseCase: FindAllAbilitiesUseCase,
    private readonly updateAbilityUseCase: UpdateAbilityUseCase,
    private readonly deleteAbilityUseCase: DeleteAbilityUseCase
  ) {}

  @ApiOperation({ summary: 'Create a new ability for a kitten' })
  @ApiResponse({ status: 201, description: 'Ability successfully created' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @ApiResponse({ status: 404, description: 'Kitten not found' })
  @Post(':kittenId')
  async create(
    @Param('kittenId') kittenId: string,
    @Body() createAbilityDto: CreateAbilityDto,
    @Request() req,
  ) {
    try {
      const ability = await this.createAbilityUseCase.execute({
        ...createAbilityDto,
        kittenId,
        userId: req.user.userId,
      });
      
      return ability.toJSON();
    } catch (error) {
      if (error instanceof KittenNotFoundError) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof NotKittenOwnerError) {
        throw new ForbiddenException(error.message);
      }
      if (
        error instanceof AbilityNameTooShortError ||
        error instanceof AbilityNameTooLongError ||
        error instanceof InvalidPowerValueError ||
        error instanceof InvalidAccuracyValueError ||
        error instanceof InvalidCooldownValueError
      ) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @ApiOperation({ summary: 'Get all abilities' })
  @ApiResponse({ status: 200, description: 'Return all abilities' })
  @ApiQuery({ name: 'kittenId', required: false, description: 'Filter by kitten ID' })
  @Get()
  async findAll(@Query('kittenId') kittenId?: string) {
    const abilities = await this.findAllAbilitiesUseCase.execute({ kittenId });
    return abilities.map(ability => ability.toJSON());
  }

  @ApiOperation({ summary: 'Get ability by id' })
  @ApiResponse({ status: 200, description: 'Return the ability' })
  @ApiResponse({ status: 404, description: 'Ability not found' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const ability = await this.findAbilityByIdUseCase.execute({ id });
      return ability.toJSON();
    } catch (error) {
      if (error instanceof AbilityNotFoundError) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @ApiOperation({ summary: 'Update an ability' })
  @ApiResponse({ status: 200, description: 'Ability successfully updated' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @ApiResponse({ status: 404, description: 'Ability not found' })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAbilityDto: UpdateAbilityDto,
    @Request() req,
  ) {
    try {
      const ability = await this.updateAbilityUseCase.execute({
        id,
        userId: req.user.userId,
        ...updateAbilityDto,
      });
      
      return ability.toJSON();
    } catch (error) {
      if (error instanceof AbilityNotFoundError) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof NotKittenOwnerError) {
        throw new ForbiddenException(error.message);
      }
      if (
        error instanceof AbilityNameTooShortError ||
        error instanceof AbilityNameTooLongError ||
        error instanceof InvalidPowerValueError ||
        error instanceof InvalidAccuracyValueError ||
        error instanceof InvalidCooldownValueError
      ) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @ApiOperation({ summary: 'Delete an ability' })
  @ApiResponse({ status: 200, description: 'Ability successfully deleted' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @ApiResponse({ status: 404, description: 'Ability not found' })
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    try {
      await this.deleteAbilityUseCase.execute({
        id,
        userId: req.user.userId,
      });
      
      return { message: 'Ability successfully deleted' };
    } catch (error) {
      if (error instanceof AbilityNotFoundError) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof NotKittenOwnerError) {
        throw new ForbiddenException(error.message);
      }
      throw error;
    }
  }
}
