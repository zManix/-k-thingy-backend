import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty, Length } from 'class-validator';

@Entity({ name: 'todo' })
export class TodoEntity {
  @PrimaryGeneratedColumn({
    primaryKeyConstraintName: 'pk-article',
  })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty()
  @Length(1, 255)
  title: string;

  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty()
  @Length(1, 255)
  description: string;

  @Column({ type: 'boolean' })
  closed: boolean = false;
}
