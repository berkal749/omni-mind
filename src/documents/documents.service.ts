import { Injectable } from '@nestjs/common';
// import { CreateDocumentDto } from './dto/create-document.dto';

@Injectable()
export class DocumentsService {
  upload(file: Express.Multer.File) {
    return {
      filename: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      // tenantId,
    };
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
