import { ApiProperty } from '@nestjs/swagger';

export class ReturnTodoDto {
  @ApiProperty({ description: 'ID of the todo item' })
  id: number;

  @ApiProperty({ description: 'Title of the todo item' })
  title: string;

  @ApiProperty({ description: 'Description of the todo item' })
  description: string;

  @ApiProperty({ description: 'Status of the todo item', default: false })
  closed: boolean;

  // Optional method to convert entity to DTO if needed by other files
  static ConvertEntityToDto(entity: any): ReturnTodoDto {
    return {
      id: entity.id,
      title: entity.title,
      description: entity.description,
      closed: entity.closed,
    };
  }
}
