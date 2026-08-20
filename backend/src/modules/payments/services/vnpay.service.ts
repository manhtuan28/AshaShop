import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { OrderDocument } from '../../orders/schemas/order.schema';

@Injectable()
export class VnPayService {
  private readonly logger = new Logger(VnPayService.name);

  constructor(private readonly configService: ConfigService) {}

  private get tmnCode(): string {
    return this.configService.get<string>('VNPAY_TMN_CODE') || '2QXUI4J4';
  }

  private get hashSecret(): string {
    return this.configService.get<string>('VNPAY_HASH_SECRET') || 'AQURBLHQDFMSMYVTLHCVGNYFJWVTLGVC';
  }

  private get vnpUrl(): string {
    return (
      this.configService.get<string>('VNPAY_URL') ||
      'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'
    );
  }

  private get defaultReturnUrl(): string {
    return (
      this.configService.get<string>('VNPAY_RETURN_URL') ||
      'http://localhost:3000/payment/vnpay-return'
    );
  }

  createPaymentUrl(order: OrderDocument, ipAddr: string, returnUrlOverride?: string): string {
    const date = new Date();
    const createDate = this.formatDate(date);

    let clientIp = ipAddr || '127.0.0.1';
    if (clientIp.includes('::ffff:')) {
      clientIp = clientIp.replace('::ffff:', '');
    }
    if (clientIp === '::1') {
      clientIp = '127.0.0.1';
    }

    const returnUrl = returnUrlOverride || this.defaultReturnUrl;
    const amount = Math.round(order.totalPrice) * 100; // VNPAY expects amount in VND * 100
    const txnRef = order._id.toString();
    const orderInfo = `Thanh toan don hang AshaShop #${txnRef}`;

    const vnpParams: Record<string, string | number> = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: this.tmnCode,
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: txnRef,
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: 'other',
      vnp_Amount: amount,
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: clientIp,
      vnp_CreateDate: createDate,
    };

    const sortedParams = this.sortObject(vnpParams);
    const signData = Object.keys(sortedParams)
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(String(sortedParams[key]))}`)
      .join('&');

    const hmac = crypto.createHmac('sha512', this.hashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    const paymentUrl = `${this.vnpUrl}?${signData}&vnp_SecureHash=${signed}`;
    this.logger.log(`Tạo VNPAY Payment URL thành công cho đơn hàng #${txnRef}`);
    return paymentUrl;
  }

  verifyReturn(params: Record<string, any>): {
    isValid: boolean;
    isSuccess: boolean;
    orderId: string;
    responseCode: string;
    transactionNo?: string;
    message: string;
  } {
    const secureHash = params['vnp_SecureHash'];
    const responseCode = params['vnp_ResponseCode'] || '';
    const orderId = params['vnp_TxnRef'] || '';
    const transactionNo = params['vnp_TransactionNo'] || '';

    const cleanParams: Record<string, string | number> = {};
    for (const key in params) {
      if (
        Object.prototype.hasOwnProperty.call(params, key) &&
        key !== 'vnp_SecureHash' &&
        key !== 'vnp_SecureHashType'
      ) {
        cleanParams[key] = params[key];
      }
    }

    const sortedParams = this.sortObject(cleanParams);
    const signData = Object.keys(sortedParams)
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(String(sortedParams[key]))}`)
      .join('&');

    const hmac = crypto.createHmac('sha512', this.hashSecret);
    const calculatedHash = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    if (!secureHash || !orderId) {
      return {
        isValid: false,
        isSuccess: false,
        orderId,
        responseCode: responseCode || '99',
        transactionNo,
        message: 'Không tìm thấy chữ ký số VNPAY hoặc mã đơn hàng hợp lệ',
      };
    }

    const isValid = calculatedHash.toLowerCase() === (secureHash || '').toLowerCase();
    const isSuccess = isValid && responseCode === '00';

    let message = 'Giao dịch thành công';
    if (!isValid) {
      message = 'Chữ ký số VNPAY không hợp lệ (Bảo mật không khớp)';
    } else if (responseCode !== '00') {
      message = this.getResponseCodeMessage(responseCode);
    }

    return {
      isValid,
      isSuccess,
      orderId,
      responseCode,
      transactionNo,
      message,
    };
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }

  private sortObject(obj: Record<string, any>): Record<string, any> {
    const sorted: Record<string, any> = {};
    const keys = Object.keys(obj).sort();
    for (const key of keys) {
      sorted[key] = obj[key];
    }
    return sorted;
  }

  private getResponseCodeMessage(code: string): string {
    const messages: Record<string, string> = {
      '00': 'Giao dịch thành công',
      '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).',
      '09': 'Thẻ/Tài khoản chưa đăng ký dịch vụ InternetBanking tại ngân hàng.',
      '10': 'Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
      '11': 'Đã hết hạn chờ thanh toán',
      '12': 'Thẻ/Tài khoản của khách hàng bị khóa.',
      '13': 'Quý khách nhập sai mật khẩu xác thực giao dịch (OTP).',
      '24': 'Khách hàng hủy giao dịch',
      '51': 'Tài khoản không đủ số dư để thực hiện giao dịch.',
      '65': 'Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.',
      '75': 'Ngân hàng thanh toán đang bảo trì.',
      '79': 'Khách hàng nhập sai mật khẩu thanh toán quá số lần quy định.',
      '99': 'Các lỗi khác',
    };
    return messages[code] || 'Giao dịch thất bại (Mã lỗi: ' + code + ')';
  }
}
