import type { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Global, Injectable, Module } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect()
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }
}

@Global()
@Module({ providers: [PrismaService], exports: [PrismaService] })
// Nest module marker; behavior is declared by its decorator.
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class DatabaseModule {}
