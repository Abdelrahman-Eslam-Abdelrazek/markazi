interface PaymobConfig {
  apiKey: string;
  hmacSecret: string;
  integrationIdCard?: string;
  integrationIdFawry?: string;
  integrationIdVodafone?: string;
  iframeId?: string;
}

interface PaymentIntentParams {
  amount: number;
  currency: string;
  method: "card" | "fawry" | "vodafone_cash" | "instapay";
  orderId: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
}

interface PaymentIntentResult {
  paymentKey: string;
  orderId: string;
  iframeUrl?: string;
  fawryReferenceNumber?: string;
}

export class PaymobClient {
  private config: PaymobConfig;
  private baseUrl = "https://accept.paymob.com/api";

  constructor(config: PaymobConfig) {
    this.config = config;
  }

  async createPaymentIntent(_params: PaymentIntentParams): Promise<PaymentIntentResult> {
    // TODO: Implement Paymob API integration
    throw new Error("Not implemented — integrate with Paymob API");
  }

  verifyWebhookSignature(payload: string, signature: string): boolean {
    const crypto = require("crypto");
    const expectedSignature = crypto
      .createHmac("sha512", this.config.hmacSecret)
      .update(payload)
      .digest("hex");
    return signature === expectedSignature;
  }
}
