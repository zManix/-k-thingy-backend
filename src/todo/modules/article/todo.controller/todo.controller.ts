import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  ParseIntPipe,
  UseGuards,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiMethodNotAllowedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ErrorUnauthorizedDto } from '../../../generic.dtos/error.unauthorized.dto';
import { ErrorDto } from '../../../generic.dtos/error.dto';
import { UserEntity } from '../../../generic.dtos/userDtoAndEntity';
import { BaseController } from '../../../base/base.controller';
import { TodoService } from '../todo.service/todo.service';
import { ReturnTodoDto } from '../dto/todo-return-dto';
import { CreateTodoDto } from '../dto/todo-create.dto';
import { UpdateTodoDto } from '../dto/todo-update.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CorrId } from '../../../decorators/correlation-id/correlation-id.decorator';
import { CurrentUser } from '../../../decorators/current-user/current-user.decorator';

@Controller('todo')
@ApiTags('Todo Methods')
@ApiBearerAuth()
export class TodoController extends BaseController {
  constructor(private readonly todoService: TodoService) {
    super('TodoController');
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOkResponse({ description: 'The record has been found.', type: ReturnTodoDto, isArray: true })
  @ApiUnauthorizedResponse({ description: 'Not logged in!', type: ErrorUnauthorizedDto })
  async findAll(@CorrId() corrId: number): Promise<ReturnTodoDto[]> {
    const methodName = 'findAll';
    this.wl(corrId, methodName);
    const arr = await this.todoService.findAll(corrId);
    return arr.map((item) => ReturnTodoDto.ConvertEntityToDto(item));
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOkResponse({ description: 'The record has been found.', type: ReturnTodoDto })
  @ApiNotFoundResponse({ description: 'The record has not been found.', type: ErrorDto })
  @ApiUnauthorizedResponse({ description: 'Not logged in!', type: ErrorUnauthorizedDto })
  async findOne(@CorrId() corrId: number, @Param('id', ParseIntPipe) id: number): Promise<ReturnTodoDto> {
    const methodName = 'findOne';
    this.wl(corrId, methodName);
    const item = await this.todoService.findOne(corrId, id);
    return ReturnTodoDto.ConvertEntityToDto(item);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiCreatedResponse({ description: 'The record has been successfully created.', type: ReturnTodoDto })
  @ApiMethodNotAllowedResponse({ description: `You don't have the right to access this record.`, type: ErrorDto })
  @ApiUnauthorizedResponse({ description: 'Not logged in!', type: ErrorUnauthorizedDto })
  async create(@CorrId() corrId: number, @Body() createTodoEntity: CreateTodoDto): Promise<ReturnTodoDto> {
    if (!createTodoEntity.description) {
      throw new BadRequestException();
    }

    if (!createTodoEntity.title) {
      throw new BadRequestException();
    }
    const methodName = 'create';
    this.wl(corrId, methodName);
    const item = await this.todoService.create(corrId, createTodoEntity);
    return ReturnTodoDto.ConvertEntityToDto(item);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOkResponse({ description: 'The record has been successfully replaced.', type: ReturnTodoDto })
  @ApiBadRequestResponse({ description: `You are not allowed to replace the record.`, type: ErrorDto })
  @ApiMethodNotAllowedResponse({ description: `You don't have the right to access this record.`, type: ErrorDto })
  @ApiUnauthorizedResponse({ description: 'Not logged in!', type: ErrorUnauthorizedDto })
  async replace(
    @CorrId() corrId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() todo: ReturnTodoDto,
  ): Promise<ReturnTodoDto> {
    const methodName = 'replace';
    this.wl(corrId, methodName);
    const item = await this.todoService.replace(corrId, id, todo);
    return ReturnTodoDto.ConvertEntityToDto(item);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOkResponse({ description: 'The record has been successfully updated.', type: ReturnTodoDto })
  @ApiNotFoundResponse({ description: 'The record has not been found.', type: ErrorDto })
  @ApiUnauthorizedResponse({ description: 'Not logged in!', type: ErrorUnauthorizedDto })
  async update(
    @CorrId() corrId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateArticleEntity: UpdateTodoDto,
  ): Promise<ReturnTodoDto> {
    const methodName = 'update';
    this.wl(corrId, methodName);
    const item = await this.todoService.update(corrId, id, updateArticleEntity);
    return ReturnTodoDto.ConvertEntityToDto(item);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOkResponse({ description: 'The record has been successfully deleted.', type: ReturnTodoDto })
  @ApiNotFoundResponse({ description: 'The record has not been found.', type: ErrorDto })
  @ApiForbiddenResponse({ description: '', type: ErrorDto })
  @ApiUnauthorizedResponse({ description: 'Not logged in!', type: ErrorUnauthorizedDto })
  async remove(
    @CurrentUser() user: UserEntity,
    @CorrId() corrId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ReturnTodoDto> {
    const methodName = 'remove';
    if (user.roles.find((f) => f === 'admin')) {
      this.wl(corrId, methodName);
      const item = await this.todoService.remove(corrId, id);
      return ReturnTodoDto.ConvertEntityToDto(item);
    } else {
      throw new ForbiddenException('You have to be a member of the role admin to call this method!');
    }
  }
}
