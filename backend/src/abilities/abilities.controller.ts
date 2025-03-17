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
} from '@nestjs/common';
import { AbilitiesService } from './abilities.service';
import { CreateAbilityDto } from './dto/create-ability.dto';
import { UpdateAbilityDto } from './dto/update-ability.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('abilities')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('abilities')
export class AbilitiesController {
  constructor(private readonly abilitiesService: AbilitiesService) {}

  @ApiOperation({ summary: 'Create a new ability for a kitten' })
  @ApiResponse({ status: 201, description: 'Ability successfully created' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @ApiResponse({ status: 404, description: 'Kitten not found' })
  @Post(':kittenId')
  create(
    @Param('kittenId') kittenId: string,
    @Body() createAbilityDto: CreateAbilityDto,
    @Request() req,
  ) {
    return this.abilitiesService.create(createAbilityDto, kittenId, req.user.userId);
  }

  @ApiOperation({ summary: 'Get all abilities' })
  @ApiResponse({ status: 200, description: 'Return all abilities' })
  @ApiQuery({ name: 'kittenId', required: false, description: 'Filter by kitten ID' })
  @Get()
  findAll(@Query('kittenId') kittenId?: string) {
    return this.abilitiesService.findAll(kittenId);
  }

  @ApiOperation({ summary: 'Get ability by id' })
  @ApiResponse({ status: 200, description: 'Return the ability' })
  @ApiResponse({ status: 404, description: 'Ability not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.abilitiesService.findOne(id);
  }

  @ApiOperation({ summary: 'Update an ability' })
  @ApiResponse({ status: 200, description: 'Ability successfully updated' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @ApiResponse({ status: 404, description: 'Ability not found' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAbilityDto: UpdateAbilityDto,
    @Request() req,
  ) {
    return this.abilitiesService.update(id, updateAbilityDto, req.user.userId);
  }

  @ApiOperation({ summary: 'Delete an ability' })
  @ApiResponse({ status: 200, description: 'Ability successfully deleted' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @ApiResponse({ status: 404, description: 'Ability not found' })
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.abilitiesService.remove(id, req.user.userId);
  }
}
