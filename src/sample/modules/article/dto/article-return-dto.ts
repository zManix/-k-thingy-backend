import { ApiProperty } from '@nestjs/swagger';
import { ArticleEntity } from '../entities/article.entity';

export class ArticleReturnDto {
  @ApiProperty({ description: 'ID of the article' })
  id: number;

  @ApiProperty({ description: 'Name of the article' })
  name: string;

  // Static method to convert an ArticleEntity to ArticleReturnDto
  static ConvertEntityToDto(entity: ArticleEntity): ArticleReturnDto {
    const dto = new ArticleReturnDto();
    dto.id = entity.id;
    dto.name = entity.name;
    return dto;
  }
}
