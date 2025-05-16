import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Order, Prisma } from '@prisma/client';
import { PrismaService } from 'src/utils/prisma.service';
import { CreateOrderDto, UpdateOrderDto } from './orders.interface';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}
  private readonly logger = new Logger(OrdersService.name);

  public async orders(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.OrderWhereUniqueInput;
    where?: Prisma.OrderWhereInput;
    orderBy?: Prisma.OrderOrderByWithRelationInput[];
  }): Promise<Order[]> {
    const { skip, take, cursor, where, orderBy } = params;

    this.logger.log('GET /v1/orders requested');

    this.logger.log('Got all orders');

    return await this.prisma.order.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy: orderBy
        ? {
            [`${orderBy}`]: 'asc',
          }
        : undefined,
    });
  }

  public async order(
    orderWhereUniqueInput: Prisma.OrderWhereUniqueInput,
  ): Promise<Order | null> {
    this.logger.log(`GET /v1/orders/${orderWhereUniqueInput.id} requested`);

    const order = await this.prisma.order.findUnique({
      where: orderWhereUniqueInput,
    });

    if (!order) {
      this.logger.error(`Order with id ${orderWhereUniqueInput.id} not found`);
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    this.logger.log(`Got order with id ${orderWhereUniqueInput.id}`);
    return order;
  }

  public async createOrder(data: CreateOrderDto): Promise<Order> {
    const modifierOrder = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.logger.debug(`Made a new order: ${JSON.stringify(modifierOrder)}`);

    const newOrder = await this.prisma.order.create({
      data: {
        total: modifierOrder.total,
        createdAt: modifierOrder.createdAt,
        userId: modifierOrder.userId,
        updatedAt: modifierOrder.updatedAt,
        products: {
          connect: modifierOrder.products.map((product) => ({
            id: product.id,
          })),
        },
      },
    });

    return newOrder;
  }

  public async updateOrder(params: {
    where: Prisma.OrderWhereUniqueInput;
    data: UpdateOrderDto;
  }): Promise<Order> {
    const { where, data } = params;

    this.logger.log(`Updated existing order with id ${where.id}`);

    try {
      const updatedOrder = await this.prisma.order.update({
        data: {
          total: data.total,
          userId: data.userId,
          products: {
            connect: data.products.map((product) => ({ id: product.id })),
          },
          updatedAt: new Date(),
        },
        where,
      });

      this.logger.log(
        `Updated for existing order with id ${where.id} successfully`,
      );
      return updatedOrder;
    } catch (error) {
      this.logger.error(`Failed to update order with id ${where.id}`, error);
      throw new HttpException(error.message, HttpStatus.CONFLICT);
    }
  }

  public async deleteOrder(params: {
    where: Prisma.OrderWhereUniqueInput;
  }): Promise<Order> {
    this.logger.log(`Deleted existing order with id ${params.where.id}`);

    const { where } = params;

    return await this.prisma.order.delete({
      where,
    });
  }
}
