import { Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from '../../../generic.dtos/userDtoAndEntity';

@Injectable()
export class UserService {
  private users: UserEntity[] = [
    {
      userId: 1,
      username: 'user',
      password: '12345',
      roles: ['user'],
    },
    {
      userId: 2,
      username: 'admin',
      password: '12345',
      roles: ['user', 'admin'],
    },
  ]; // Mock database

  findOne(username: string): UserEntity | undefined {
    return this.users.find((user) => user.username === username);
  }

  findById(id: number): UserEntity | undefined {
    return this.users.find((user) => user.userId === id);
  }

  remove(id: number): void {
    const index = this.users.findIndex((user) => user.userId === id);
    if (index === -1) {
      throw new NotFoundException('User not found');
    }
    this.users.splice(index, 1);
  }
}
