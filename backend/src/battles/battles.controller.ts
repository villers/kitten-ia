import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateBattleDto } from '@/battles/dto/create-battle.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CreateBattleCommand, CreateBattleUseCase } from '@/battles/application/usecases/create-battle.usecase';
import { FindBattleByIdQuery, FindBattleByIdUseCase } from '@/battles/application/usecases/find-battle-by-id.usecase';
import { FindAllBattlesQuery, FindAllBattlesUseCase } from '@/battles/application/usecases/find-all-battles.usecase';
import { BattleNotFoundError, KittenNotFoundError, NotOwnerError, SelfBattleError } from '@/battles/domain/errors';

@ApiTags('battles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('battles')
export class BattlesController {
  constructor(
    private readonly createBattleUseCase: CreateBattleUseCase,
    private readonly findBattleByIdUseCase: FindBattleByIdUseCase,
    private readonly findAllBattlesUseCase: FindAllBattlesUseCase,
  ) {}

  @ApiOperation({ summary: 'Create a new battle between kittens' })
  @ApiResponse({ status: 201, description: 'Battle successfully created' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @ApiResponse({ status: 404, description: 'Kitten not found' })
  @Post(':challengerId')
  async create(
    @Param('challengerId') challengerId: string,
    @Body() createBattleDto: CreateBattleDto,
    @Request() req,
  ) {
    try {
      const command = new CreateBattleCommand(
        challengerId,
        createBattleDto.opponentId,
        req.user.userId,
      );
      
      const battle = await this.createBattleUseCase.execute(command);
      
      return battle;
    } catch (error) {
      if (error instanceof KittenNotFoundError) {
        throw new NotFoundException(error.message);
      } else if (error instanceof NotOwnerError || error instanceof SelfBattleError) {
        throw new ForbiddenException(error.message);
      }
      throw error;
    }
  }

  @ApiOperation({ summary: 'Get all battles' })
  @ApiResponse({ status: 200, description: 'Return all battles' })
  @ApiQuery({ name: 'userId', required: false, description: 'Filter battles by user ID' })
  @Get()
  async findAll(@Query('userId') userId?: string) {
    const query = new FindAllBattlesQuery(userId);
    return this.findAllBattlesUseCase.execute(query);
  }

  @ApiOperation({ summary: 'Get my battles' })
  @ApiResponse({ status: 200, description: 'Return all battles for the current user' })
  @Get('my-battles')
  async findMyBattles(@Request() req) {
    const query = new FindAllBattlesQuery(req.user.userId);
    return this.findAllBattlesUseCase.execute(query);
  }

  @ApiOperation({ summary: 'Get battle by id' })
  @ApiResponse({ status: 200, description: 'Return the battle' })
  @ApiResponse({ status: 404, description: 'Battle not found' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const query = new FindBattleByIdQuery(id);
      return await this.findBattleByIdUseCase.execute(query);
    } catch (error) {
      if (error instanceof BattleNotFoundError) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}