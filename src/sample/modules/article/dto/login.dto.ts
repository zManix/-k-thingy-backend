import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: 'Username for login' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ description: 'Password for login' })
  @IsNotEmpty()
  @IsString()
  password: string;

  // If there are additional fields needed for login, include them here.
}
