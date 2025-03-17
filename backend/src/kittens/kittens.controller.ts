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
} from '@nestjs/common';
import { KittensService } from './kittens.service';
import { CreateKittenDto } from './dto/create-kitten.dto';
import { UpdateKittenDto } from './dto/update-kitten.dto';
import { AssignSkillPointsDto } from './dto/assign-skill-points.dto';
import { AssignAbilityDto } from './dto/assign-ability.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('kittens')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('kittens')
export class KittensController {
  constructor(private readonly kittensService: KittensService) {}

  @ApiOperation({ summary: 'Create a new kitten' })
  @ApiResponse({ status: 201, description: 'Kitten successfully created' })
  @Post()
  create(@Body() createKittenDto: CreateKittenDto, @Request() req) {
    return this.kittensService.create(createKittenDto, req.user.userId);
  }

  @ApiOperation({ summary: 'Get all kittens' })
  @ApiResponse({ status: 200, description: 'Return all kittens' })
  @Get()
  findAll(@Request() req) {
    return this.kittensService.findAll(req.user.userId);
  }

  @ApiOperation({ summary: 'Get kitten by id' })
  @ApiResponse({ status: 200, description: 'Return the kitten' })
  @ApiResponse({ status: 404, description: 'Kitten not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.kittensService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a kitten' })
  @ApiResponse({ status: 200, description: 'Kitten successfully updated' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @ApiResponse({ status: 404, description: 'Kitten not found' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateKittenDto: UpdateKittenDto,
    @Request() req,
  ) {
    return this.kittensService.update(id, updateKittenDto, req.user.userId);
  }

  @ApiOperation({ summary: 'Delete a kitten' })
  @ApiResponse({ status: 200, description: 'Kitten successfully deleted' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @ApiResponse({ status: 404, description: 'Kitten not found' })
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.kittensService.remove(id, req.user.userId);
  }

  @ApiOperation({ summary: 'Assign skill points to kitten attributes' })
  @ApiResponse({ status: 200, description: 'Skill points successfully assigned' })
  @ApiResponse({ status: 400, description: 'Not enough skill points' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @ApiResponse({ status: 404, description: 'Kitten not found' })
  @Patch(':id/skills')
  assignSkillPoints(
    @Param('id') id: string,
    @Body() assignSkillPointsDto: AssignSkillPointsDto,
    @Request() req,
  ) {
    return this.kittensService.assignSkillPoints(
      id,
      assignSkillPointsDto,
      req.user.userId,
    );
  }

  @ApiOperation({ summary: 'Assign ability to kitten' })
  @ApiResponse({ status: 200, description: 'Ability successfully assigned' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @ApiResponse({ status: 404, description: 'Kitten or ability not found' })
  @Patch(':id/abilities')
  assignAbility(
    @Param('id') id: string,
    @Body() assignAbilityDto: AssignAbilityDto,
    @Request() req,
  ) {
    return this.kittensService.assignAbility(
      id,
      assignAbilityDto.abilityId,
      req.user.userId,
    );
  }
}
