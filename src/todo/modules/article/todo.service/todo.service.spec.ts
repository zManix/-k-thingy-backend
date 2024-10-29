import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';
import { Repository } from 'typeorm';
import { TodoEntity } from '../entities/todo.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockType, RepositoryMockFactory } from '../../../mocktypes/mocktype';
import {
  BadRequestException,
  InternalServerErrorException,
  MethodNotAllowedException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateTodoDto } from '../dto/todo-update.dto';

const todo: { id: number; title: string } = {
  id: 1,
  title: 'Mein Artikel',
};

describe('TodoService', () => {
  let service: TodoService;
  let repositoryMock: MockType<Repository<TodoEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TodoService, { provide: getRepositoryToken(TodoEntity), useFactory: RepositoryMockFactory }],
    }).compile();
    service = module.get<TodoService>(TodoService);
    repositoryMock = module.get(getRepositoryToken(TodoEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('findAll', async () => {
    const arr = [];
    repositoryMock.find.mockReturnValue(arr);
    expect(await service.findAll(0)).toEqual(arr);
  });
  it('findAll error', async () => {
    repositoryMock.find.mockImplementation(() => {
      throw new InternalServerErrorException();
    });
    expect(service.findAll(0)).rejects.toBeInstanceOf(InternalServerErrorException);
  });
  it('findOne', async () => {
    repositoryMock.findOneBy.mockReturnValue(todo);
    const id = 1;
    expect(await service.findOne(0, id)).toEqual(todo);
    expect(repositoryMock.findOneBy).toHaveBeenCalledWith({ id });
  });
  it('findOne not found', async () => {
    repositoryMock.findOneBy.mockReturnValue(null);
    const id = 1;
    try {
      await service.findOne(0, id);
    } catch (err: any) {
      expect(err instanceof NotFoundException).toEqual(true);
      expect(err.message).toEqual('We did not found a article item with id 1!');
    }
  });
  it('create', async () => {
    repositoryMock.insert.mockReturnValue({ identifiers: [1] });
    repositoryMock.findOneBy.mockReturnValue(todo);
    const obj = await service.create(0, { title: 'Mein Artikel' });
    expect(obj).toEqual(todo);
  });
  it('replace', async () => {
    repositoryMock.update.mockReturnValue(todo);
    repositoryMock.findOneBy.mockReturnValue(todo);
    const obj = await service.replace(0, 1, {
      id: 1,
      title: 'Mein Artikel',
    });
    expect(obj).toEqual(todo);
  });
  it('replace not right id', async () => {
    repositoryMock.update.mockReturnValue(todo);
    repositoryMock.findOneBy.mockReturnValue(null);
    try {
      await service.replace(0, 1, {
        id: 2,
        title: 'Mein Artikel',
      });
    } catch (err: any) {
      expect(err instanceof BadRequestException).toEqual(true);
      expect(err.message).toEqual(
        'You try to replace the id 1 with an object who has the id 2 this is now allowed as otherwise we can have multiple times the same id!',
      );
    }
  });
  it('replace not found', async () => {
    repositoryMock.update.mockReturnValue(todo);
    repositoryMock.findOneBy.mockReturnValue(null);
    try {
      await service.replace(0, 2, {
        id: 2,
        title: 'Mein Artikel',
      });
    } catch (err: any) {
      expect(err instanceof MethodNotAllowedException).toEqual(true);
      expect(err.message).toEqual(
        "You can't replace a non existing entity item with id 2! Consider to post a new record.",
      );
    }
  });
  it('replace missing properties', async () => {
    repositoryMock.update.mockReturnValue(todo);
    repositoryMock.findOneBy.mockReturnValue(null);
    try {
      await service.replace(0, 2, {
        id: 2,
        title: null,
      });
    } catch (err: any) {
      expect(err instanceof BadRequestException).toEqual(true);
      expect(err.message).toEqual('The required field name is missing in the object!');
    }
  });
  it('update', async () => {
    repositoryMock.update.mockReturnValue(todo);
    repositoryMock.findOneBy.mockReturnValue(todo);
    const obj = await service.update(0, 1, { title: 'Mein neuer Name' });
    expect(obj).toEqual(todo);
  });
  it('update not found', async () => {
    repositoryMock.update.mockReturnValue(todo);
    repositoryMock.findOneBy.mockReturnValue(null);
    try {
      await service.update(0, 1, { title: 'Mein neuer Name' });
    } catch (err: any) {
      expect(err instanceof NotFoundException).toEqual(true);
      expect(err.message).toEqual('We did not found a article item with id 1!');
    }
  });
  it('update wrong property found', async () => {
    repositoryMock.update.mockReturnValue(todo);
    repositoryMock.findOneBy.mockReturnValue(todo);
    try {
      await service.update(0, todo.id, { title: 'Mein neuer Name', wrong: '' } as UpdateTodoDto);
    } catch (err: any) {
      expect(err instanceof NotFoundException).toEqual(true);
      expect(err.message).toEqual('We did not found a article item with id 1!');
    }
  });
  it('remove', async () => {
    repositoryMock.delete.mockReturnValue(todo);
    repositoryMock.findOneBy.mockReturnValue(todo);
    const obj = await service.remove(0, 1);
    expect(obj).toEqual(todo);
  });
  it('remove not found', async () => {
    repositoryMock.delete.mockReturnValue(todo);
    repositoryMock.findOneBy.mockReturnValue(null);

    try {
      await service.remove(0, 1);
    } catch (err: any) {
      expect(err instanceof NotFoundException).toEqual(true);
      expect(err.message).toEqual('We did not found a article item with id 1!');
    }
  });
});
