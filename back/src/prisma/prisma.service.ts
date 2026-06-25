import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';
import { env } from 'prisma/config';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
   const adapter = new PrismaPg(env("DATABASE_URL"));
    super({ adapter });
  }
}
