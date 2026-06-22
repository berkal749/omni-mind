import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsUUID,
} from 'class-validator';

// Assuming you have a DocumentStatus enum exported from your Prisma client
export enum DocumentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export class CreateDocumentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(DocumentStatus)
  @IsOptional() // Optional because it defaults to PENDING in the schema
  status?: DocumentStatus;

  @IsString()
  @IsNotEmpty()
  fileUrl: string;

  @IsUUID()
  @IsNotEmpty()
  workspaceId: string;
}
