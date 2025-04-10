import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly replicaClient: PrismaClient;
  
  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL_MAIN,
        },
      },
    });
    
    this.replicaClient = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL_REPLICA,
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
    await this.replicaClient.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
    await this.replicaClient.$disconnect();
  }

  get read() {
    return this.replicaClient;
  }
  
  get write() {
    return this;
  }
}