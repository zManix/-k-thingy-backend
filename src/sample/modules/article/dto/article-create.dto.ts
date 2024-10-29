import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ArticleCreateDto {
  @ApiProperty({ description: 'Name of the article' })
  @IsNotEmpty()
  name: string;
}
