import { loadScript } from "@/lib/scriptLoader";

declare global {
  interface Window {
    PaystackPop: any;
  }
}

export type PaystackInit = {
  publicKey: string;
  email: string;
  amountKobo: number; // amount in kobo
  reference: string; // unique reference, ideally order id
  metadata?: Record<string, any>;
  onSuccess?: (reference: string) => void;
  onCancel?: () => void;
};

export async function initPaystack(opts: PaystackInit) {
  await loadScript("https://js.paystack.co/v1/inline.js", "PaystackPop");
  const handler = window.PaystackPop.setup({
    key: opts.publicKey,
    email: opts.email,
    amount: opts.amountKobo,
    ref: opts.reference,
    metadata: opts.metadata || {},
    currency: "NGN",
    callback: function () {
      opts.onSuccess?.(opts.reference);
    },
    onClose: function () {
      opts.onCancel?.();
    },
  });
  handler.openIframe();
}
