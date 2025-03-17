import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { BattlesService } from './battles.service';
import { CreateBattleDto } from './dto/create-battle.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('battles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('battles')
export class BattlesController {
  constructor(private readonly battlesService: BattlesService) {}

  @ApiOperation({ summary: 'Create a new battle between kittens' })
  @ApiResponse({ status: 201, description: 'Battle successfully created' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @ApiResponse({ status: 404, description: 'Kitten not found' })
  @Post(':challengerId')
  create(
    @Param('challengerId') challengerId: string,
    @Body() createBattleDto: CreateBattleDto,
    @Request() req,
  ) {
    return this.battlesService.create(createBattleDto, challengerId, req.user.userId);
  }

  @ApiOperation({ summary: 'Get all battles' })
  @ApiResponse({ status: 200, description: 'Return all battles' })
  @ApiQuery({ name: 'userId', required: false, description: 'Filter battles by user ID' })
  @Get()
  findAll(@Query('userId') userId?: string) {
    return this.battlesService.findAll(userId);
  }

  @ApiOperation({ summary: 'Get my battles' })
  @ApiResponse({ status: 200, description: 'Return all battles for the current user' })
  @Get('my-battles')
  findMyBattles(@Request() req) {
    return this.battlesService.findAll(req.user.userId);
  }

  @ApiOperation({ summary: 'Get battle by id' })
  @ApiResponse({ status: 200, description: 'Return the battle' })
  @ApiResponse({ status: 404, description: 'Battle not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.battlesService.findOne(id);
  }
}
