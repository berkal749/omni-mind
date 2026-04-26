import { config as loadEnv } from 'dotenv';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

loadEnv();
loadEnv({ path: '.env.local', override: true });

const connectionString =
  process.env.DATABASE_URL ?? process.env.DIRECT_URL ?? 'postgresql://localhost:5432/postgres';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({ adapter: new PrismaPg(new Pool({ connectionString })) });
  }

  async onModuleInit() {
    await this.$connect();
  }
}