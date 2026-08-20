import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { OrderDocument } from '../../orders/schemas/order.schema';

@Injectable()
export class MomoService {
  private readonly logger = new Logger(MomoService.name);

  constructor(private readonly configService: ConfigService) {}

  private get partnerCode(): string {
    return this.configService.get<string>('MOMO_PARTNER_CODE') || 'MOMO';
  }

  private get accessKey(): string {
    return this.configService.get<string>('MOMO_ACCESS_KEY') || 'F8BBA842ECF85';
  }

  private get secretKey(): string {
    return this.configService.get<string>('MOMO_SECRET_KEY') || 'K951B6PE1wa8ngT4df13TJ0Bi0i9p3TM';
  }

  private get apiUrl(): string {
    return (
      this.configService.get<string>('MOMO_API_URL') ||
      'https://test-payment.momo.vn/v2/gateway/api/create'
    );
  }

  private get defaultRedirectUrl(): string {
    return (
      this.configService.get<string>('MOMO_REDIRECT_URL') ||
      'http://localhost:3000/payment/momo-return'
    );
  }

  private get defaultIpnUrl(): string {
    return (
      this.configService.get<string>('MOMO_IPN_URL') ||
      'http://localhost:5000/api/v1/payments/momo-ipn'
    );
  }

  async createPaymentUrl(
    order: OrderDocument,
    redirectUrlOverride?: string,
  ): Promise<{ payUrl: string; qrCodeUrl?: string; deeplink?: string }> {
    const rawOrderId = order._id.toString();
    const momoOrderId = `${rawOrderId}_${Date.now()}`;
    const requestId = `${rawOrderId}_${Date.now()}`;
    const amount = Math.round(order.totalPrice);
    const orderInfo = `Thanh toan don hang AshaShop #${rawOrderId}`;
    const redirectUrl = redirectUrlOverride || this.defaultRedirectUrl;
    const ipnUrl = this.defaultIpnUrl;
    const requestType = 'captureWallet';
    const extraData = Buffer.from(JSON.stringify({ orderId: rawOrderId })).toString('base64');

    const rawSignature = `accessKey=${this.accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${momoOrderId}&orderInfo=${orderInfo}&partnerCode=${this.partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

    const signature = crypto
      .createHmac('sha256', this.secretKey)
      .update(rawSignature)
      .digest('hex');

    const requestBody = {
      partnerCode: this.partnerCode,
      partnerName: 'AshaShop Fashion',
      storeId: 'AshaShopStore',
      requestId,
      amount,
      orderId: momoOrderId,
      orderInfo,
      redirectUrl,
      ipnUrl,
      lang: 'vi',
      extraData,
      requestType,
      signature,
    };

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      if (data && data.payUrl) {
        this.logger.log(`Tạo MoMo payment URL thành công cho đơn #${rawOrderId}`);
        return {
          payUrl: data.payUrl,
          qrCodeUrl: data.qrCodeUrl,
          deeplink: data.deeplink,
        };
      } else {
        this.logger.warn(`MoMo API trả về: ${JSON.stringify(data)}`);
        throw new Error(data?.message || 'MoMo Sandbox API từ chối tạo giao dịch');
      }
    } catch (error) {
      this.logger.error(`Lỗi khi gọi MoMo API: ${error.message}`);
      throw new Error(`Cổng MoMo Sandbox: ${error.message}`);
    }
  }

  verifyReturn(params: Record<string, any>): {
    isValid: boolean;
    isSuccess: boolean;
    orderId: string;
    resultCode: number;
    message: string;
  } {
    const rawOrderId = params['orderId'] || '';
    const cleanOrderId = rawOrderId.includes('_') ? rawOrderId.split('_')[0] : rawOrderId;
    const resultCode = parseInt(params['resultCode'] ?? '-1', 10);
    const message = params['message'] || (resultCode === 0 ? 'Giao dịch MoMo thành công' : 'Giao dịch MoMo thất bại');
    const signature = params['signature'];

    if (!rawOrderId || !signature) {
      return {
        isValid: false,
        isSuccess: false,
        orderId: cleanOrderId,
        resultCode: resultCode || -1,
        message: 'Không tìm thấy chữ ký số hoặc mã giao dịch MoMo hợp lệ',
      };
    }

    const isSuccess = resultCode === 0;

    return {
      isValid: true,
      isSuccess,
      orderId: cleanOrderId,
      resultCode,
      message,
    };
  }
}
