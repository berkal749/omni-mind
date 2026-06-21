import { Injectable } from '@nestjs/common';
import { StorageService } from './storage.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
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
    // src/documents/documents.service.ts
    const fileUrl = await this.storageService.uploadFile(file, workspaceId);

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

  findAll() {
    return `This action returns all documents`;
  }

  findOne(id: number) {
    return `This action returns a #${id} document`;
  }

  update(id: number) {
    return `This action updates a #${id} document`;
  }

  remove(id: number) {
    return `This action removes a #${id} document`;
  }
}
