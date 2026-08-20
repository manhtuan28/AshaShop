import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { VnPayService } from './services/vnpay.service';
import { MomoService } from './services/momo.service';
import { PaypalService } from './services/paypal.service';
import { Order, OrderSchema } from '../orders/schemas/order.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, VnPayService, MomoService, PaypalService],
  exports: [PaymentsService, VnPayService, MomoService, PaypalService],
})
export class PaymentsModule {}
