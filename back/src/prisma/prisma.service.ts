import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import 'dotenv/config';
import { env } from 'prisma/config';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
   const adapter = new PrismaMariaDb(env("DATABASE_URL"));
    super({ adapter });
  }
}
