import { BadRequestException, Injectable } from '@nestjs/common';
import { StorageService } from './storage.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import * as path from 'path';
import { UpdateDocumentDto } from './dto/update-document.dto.js';
// import { CreateDocumentDto } from './dto/create-document.dto';

@Injectable()
export class DocumentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {}
  // Inside documents.service.ts
  // Inside documents.service.ts
  async handleDocumentUpload(file: Express.Multer.File, workspaceId: string) {
    const fileTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'text/plain',
      'application/json',
    ];
    if (fileTypes.includes(file.mimetype) === false) {
      throw new BadRequestException('file tpe not supported');
    }

    const fileExt = path.extname(file.originalname).toLowerCase();
    const allowedExtensions = ['.pdf', '.txt', '.json', '.md', '.jpeg', '.png'];
    if (!allowedExtensions.includes(fileExt)) {
      throw new BadRequestException('file extenston not supported');
    }
    // src/documents/documents.service.ts
    const fileKey = await this.storageService.uploadFile(file, workspaceId);
    const minioEndpoint = process.env.MINIO_ENDPOINT || 'http://localhost:9000';
    const fileUrl = '${minioEndpoint}/${this.bucketName}/${fileKey}';

    // Then create the record in Prisma
    const document = await this.prisma.document.create({
      data: {
        name: file.originalname,
        fileUrl: fileUrl,
        status: 'PENDING', // Ready for RabbitMQ to take over later
        workspaceId: workspaceId,
      },
    });

    // 3. TODO: publish to RabbitMQ exchange (e.g., this.rabbitMq.publish(document))

    return document;
  }

  async findAllDocs(workspaceId: string) {
    return await this.prisma.document.findMany({
      where: { workspaceId },
    });
  }

  remove(workspaceId: string, name: string) {
    return this.prisma.document.delete({
      where: {
        workspaceId_name: {
          workspaceId,
          name,
        },
      },
    });
  }
}
