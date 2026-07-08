import { HotmartPaymentProvider } from "./hotmart-provider.js";
import type { PaymentProvider } from "./types.js";

export function createPaymentProvider(): PaymentProvider {
  return new HotmartPaymentProvider();
}
