import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { PrismaService } from 'src/utils/prisma.service';

@Module({
  controllers: [OrdersController],
  exports: [OrdersService],
  providers: [OrdersService, PrismaService],
})
export class OrdersModule {}
