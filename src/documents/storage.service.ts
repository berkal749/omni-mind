import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class StorageService {
  private s3Client: S3Client;
  private bucketName = 'omnimind-documents';

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

  async uploadFile(
    file: Express.Multer.File,
    workspaceId: string,
  ): Promise<string> {
    const fileKey = `workspaces/${workspaceId}/${Date.now()}-${file.originalname}`;

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    // Return the stable asset endpoint string to be saved in Prisma
    return `${this.bucketName}/${fileKey}`;
  }
}
