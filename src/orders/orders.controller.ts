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
} from '@nestjs/common';
import {
  CreateOrderDto,
  Order,
  UpdateOrderDto,
  User,
} from './orders.interface';
import { OrdersService } from './orders.service';

@Controller('orders')
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
  public async orders(): Promise<Omit<Order, 'products'>[]> {
    try {
      const orders = await this.ordersService.orders({});
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
  ): Promise<Order> {
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
