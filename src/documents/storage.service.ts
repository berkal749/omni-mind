import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class StorageService {
  private s3Client: S3Client;
  private bucketName: string = 'omnimind-documents';

  constructor() {
    this.s3Client = new S3Client({
      region: 'us-east-1', // MinIO requires a placeholder region
      endpoint: 'http://localhost:9000', // Points to your local MinIO container
      credentials: {
        accessKeyId: 'minioadmin',
        secretAccessKey: 'minioadminpassword',
      },
      forcePathStyle: true, // Necessary for MinIO tracking
    });
  }

  // Add this method right below your constructor
  async uploadFile(
    file: Express.Multer.File,
    workspaceId: string,
  ): Promise<string> {
    // Organizes files cleanly inside your bucket: workspaces/id/timestamp-filename.pdf
    const fileKey = `workspaces/${workspaceId}/${Date.now()}-${file.originalname}`;

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
        Body: file.buffer, // The binary file data from NestJS
        ContentType: file.mimetype, // Ensures PDFs stay PDFs when accessed
      }),
    );

    // Return the lookup path string to be stored in your Prisma PostgreSQL database
    return `${this.bucketName}/${fileKey}`;
  }
}
