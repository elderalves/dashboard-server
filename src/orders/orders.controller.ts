import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { Order, UpdateOrderDto } from './orders.interface';
import { OrdersService } from './orders.service';
import { Prisma } from '@prisma/client';

@Controller('/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}
  private readonly logger = new Logger(OrdersController.name);

  // @Post()
  // public async create(
  //   @Body() user: User,
  //   order: CreateOrderDto,
  // ): Promise<Omit<Order, 'products'>> {
  //   if (!user) {
  //     throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
  //   }
  // }

  @Get()
  public async orders(
    @Query('take') take: number,
    @Query('skip') skip: number,
    @Query('cursor') cursor: Prisma.OrderWhereUniqueInput,
    @Query('where') where: Prisma.OrderWhereInput,
    @Query('orderBy') orderBy: Prisma.OrderOrderByWithRelationInput[],
  ): Promise<Omit<Order, 'products'>[]> {
    try {
      this.logger.debug(take);
      const orders = await this.ordersService.orders({
        skip,
        take,
        cursor,
        where,
        orderBy,
      });
      return orders;
    } catch (err) {
      if (err) {
        throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      }

      throw new HttpException('Generic', HttpStatus.BAD_GATEWAY);
    }
  }

  @Patch(':id')
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() order: UpdateOrderDto,
  ): Promise<Omit<Order, 'products'>> {
    try {
      return await this.ordersService.updateOrder({
        where: { id },
        data: order,
      });
    } catch (err) {
      if (err) {
        throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      }

      throw new HttpException('Generic', HttpStatus.BAD_GATEWAY);
    }
  }
}
