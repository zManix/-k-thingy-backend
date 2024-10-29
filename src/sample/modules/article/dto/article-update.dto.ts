import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ArticleUpdateDto {
  @ApiProperty({ description: 'Name of the article', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  // Include any other fields relevant for the update.
}
