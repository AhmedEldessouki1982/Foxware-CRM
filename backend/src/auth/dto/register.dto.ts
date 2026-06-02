import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'Ahmed',
  })
  @IsString()
  firstName!: string;

  @ApiProperty({
    example: 'Eldessouki',
  })
  @IsString()
  lastName!: string;

  @ApiProperty({
    example: 'user@example.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'StrongPassword123',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  password!: string;
}
