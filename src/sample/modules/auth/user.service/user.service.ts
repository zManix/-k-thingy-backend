import { Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from '../../article/entities/user.entity';

@Injectable()
export class UserService {
  private users: UserEntity[] = []; // Mock database

  findOne(username: string): UserEntity | undefined {
    return this.users.find(user => user.username === username);
  }

  findById(id: number): UserEntity | undefined {
    return this.users.find(user => user.id === id);
  }

  remove(id: number): void {
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) {
      throw new NotFoundException('User not found');
    }
    this.users.splice(index, 1);
  }
}
