import { loadScript } from "@/lib/scriptLoader";

declare global {
  interface Window {
    FlutterwaveCheckout: any;
  }
}

export type FlutterwaveInit = {
  publicKey: string;
  email: string;
  phone_number?: string;
  name?: string;
  amount: number; // amount in NGN
  tx_ref: string; // unique reference, ideally order id
  meta?: Record<string, any>;
  onSuccess?: (txRef: string) => void;
  onCancel?: () => void;
};

export async function initFlutterwave(opts: FlutterwaveInit) {
  await loadScript("https://checkout.flutterwave.com/v3.js", "FlutterwaveCheckout");
  const checkout = window.FlutterwaveCheckout({
    public_key: opts.publicKey,
    tx_ref: opts.tx_ref,
    amount: opts.amount,
    currency: "NGN",
    customer: {
      email: opts.email,
      name: opts.name,
      phonenumber: opts.phone_number,
    },
    meta: opts.meta || {},
    callback: function (data: any) {
      // data.status === 'successful'
      if (data?.status === 'successful') {
        opts.onSuccess?.(opts.tx_ref);
      }
    },
    onclose: function () {
      opts.onCancel?.();
    },
    customizations: {
      title: "TPEC Checkout",
      description: "Complete your payment",
    },
  });
  return checkout;
}
