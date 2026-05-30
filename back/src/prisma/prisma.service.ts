import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import 'dotenv/config';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
   const adapter = new PrismaMariaDb(process.env.DATABASE_URL as string);
    super({ adapter });
  }
}
