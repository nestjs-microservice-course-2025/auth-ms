import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);
  constructor() {
    super();
  }
  onModuleInit() {
    this.$connect();
    this.logger.log('Connected to MongoDB database');
  }
}
