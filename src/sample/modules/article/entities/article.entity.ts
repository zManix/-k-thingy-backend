import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty, Length } from 'class-validator';

@Entity({ name: 'article' })
export class ArticleEntity {
  @PrimaryGeneratedColumn({
    primaryKeyConstraintName: 'pk-article',
  })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty()
  @Length(1, 255)
  name: string;
}
