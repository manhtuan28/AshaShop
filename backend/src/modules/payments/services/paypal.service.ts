import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OrderDocument } from '../../orders/schemas/order.schema';

@Injectable()
export class PaypalService {
  private readonly logger = new Logger(PaypalService.name);

  constructor(private readonly configService: ConfigService) {}

  private get clientId(): string {
    return this.configService.get<string>('PAYPAL_CLIENT_ID') || 'sb';
  }

  private get clientSecret(): string {
    return this.configService.get<string>('PAYPAL_CLIENT_SECRET') || '';
  }

  private get apiUrl(): string {
    return (
      this.configService.get<string>('PAYPAL_API_URL') ||
      'https://api-m.sandbox.paypal.com'
    );
  }

  private get defaultReturnUrl(): string {
    return (
      this.configService.get<string>('PAYPAL_RETURN_URL') ||
      'http://localhost:3000/payment/paypal-return'
    );
  }

  async createPaymentUrl(
    order: OrderDocument,
    returnUrlOverride?: string,
  ): Promise<{ payUrl: string; paypalOrderId?: string }> {
    const rawOrderId = order._id.toString();
    const returnUrl = returnUrlOverride || this.defaultReturnUrl;
    const cancelUrl = `${returnUrl}?status=cancelled&orderId=${rawOrderId}`;

    // Convert VND to USD (approx rate 1 USD = 25,000 VND)
    const usdAmount = Math.max(1, Math.round((order.totalPrice / 25000) * 100) / 100).toFixed(2);

    if (this.clientId && this.clientSecret && this.clientId !== 'sb') {
      try {
        const accessToken = await this.getAccessToken();
        const response = await fetch(`${this.apiUrl}/v2/checkout/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            intent: 'CAPTURE',
            purchase_units: [
              {
                reference_id: rawOrderId,
                description: `AshaShop Order #${rawOrderId}`,
                amount: {
                  currency_code: 'USD',
                  value: usdAmount,
                },
              },
            ],
            application_context: {
              brand_name: 'AshaShop Fashion',
              landing_page: 'BILLING',
              user_action: 'PAY_NOW',
              return_url: `${returnUrl}?orderId=${rawOrderId}`,
              cancel_url: cancelUrl,
            },
          }),
        });

        const orderData = await response.json();
        const approveLink = orderData?.links?.find((l: any) => l.rel === 'approve')?.href;
        if (approveLink) {
          this.logger.log(`Tạo PayPal order thành công: ${orderData.id}`);
          return { payUrl: approveLink, paypalOrderId: orderData.id };
        } else {
          throw new Error(orderData?.message || 'PayPal API từ chối tạo phiên thanh toán');
        }
      } catch (error) {
        this.logger.error(`Lỗi tạo đơn hàng PayPal API: ${error.message}`);
        throw new Error(`Cổng PayPal Sandbox: ${error.message}`);
      }
    }

    throw new Error('Chưa cấu hình PAYPAL_CLIENT_ID & PAYPAL_CLIENT_SECRET trong backend/.env');
  }

  async captureOrder(paypalOrderId: string): Promise<{ isSuccess: boolean; status: string }> {
    if (this.clientId && this.clientSecret && this.clientId !== 'sb') {
      try {
        const accessToken = await this.getAccessToken();
        const response = await fetch(
          `${this.apiUrl}/v2/checkout/orders/${paypalOrderId}/capture`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        const data = await response.json();
        const status = data.status;
        return { isSuccess: status === 'COMPLETED', status };
      } catch (error) {
        this.logger.error(`Lỗi capture PayPal order: ${error.message}`);
        return { isSuccess: false, status: 'ERROR' };
      }
    }

    return { isSuccess: false, status: 'NO_CREDENTIALS' };
  }

  verifyReturn(params: Record<string, any>): {
    isValid: boolean;
    isSuccess: boolean;
    orderId: string;
    message: string;
  } {
    const orderId = params['orderId'] || '';
    const status = params['status'];
    const token = params['token'];
    const payerId = params['PayerID'];

    if (!orderId || (!payerId && !token) || status === 'cancelled') {
      return {
        isValid: false,
        isSuccess: false,
        orderId,
        message: 'Giao dịch PayPal đã bị hủy hoặc không tìm thấy thông tin thanh toán hợp lệ',
      };
    }

    return {
      isValid: true,
      isSuccess: true,
      orderId,
      message: 'Thanh toán PayPal thành công',
    };
  }

  private async getAccessToken(): Promise<string> {
    const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
    const response = await fetch(`${this.apiUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    const data = await response.json();
    return data.access_token;
  }
}
