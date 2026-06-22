import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateWorkspaceDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100) // Keeps your database healthy and prevents excessively long names
  name: string;
}
