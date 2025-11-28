import { getProductById } from "@/constants/products";
import Image from "next/image";
import PaymentForm from "@/components/ui/PaymentForm";
import { formatPrice } from "@/lib/utils";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function CheckoutPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const productIdParam = sp.productId;
  const sizeParam = sp.size;
  const colorParam = sp.color;
  const qtyParam = sp.qty;

  const productId = Number(Array.isArray(productIdParam) ? productIdParam[0] : productIdParam);
  const size = Array.isArray(sizeParam) ? sizeParam[0] : sizeParam;
  const color = Array.isArray(colorParam) ? colorParam[0] : colorParam;
  const qty = Number(Array.isArray(qtyParam) ? qtyParam[0] : qtyParam) || 1;

  const product = Number.isFinite(productId) ? getProductById(productId) : undefined;
  const imageVal = product && color ? product.image[color] ?? Object.values(product.image)[0] : undefined;
  const imageSrc = Array.isArray(imageVal) ? imageVal[0] : imageVal;

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight text-neutral-900">Checkout</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Order summary */}
        <div className="md:col-span-2 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          {product ? (
            <div className="flex items-start gap-4">
              <div className="relative h-28 w-28 overflow-hidden rounded-lg bg-neutral-100">
                {imageSrc && (
                  <Image src={imageSrc} alt={product.name} fill className="object-contain" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-base font-semibold text-neutral-900">{product.name}</h2>
                    <div className="mt-1 text-sm text-neutral-600">
                      {size ? <span>Size: {size}</span> : null}
                      {size && color ? <span className="mx-2">•</span> : null}
                      {color ? <span>Color: {color}</span> : null}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-neutral-500">Unit price</div>
                    <div className="text-base font-semibold">{formatPrice(product.price)}</div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-sm text-neutral-600">Quantity: {qty}</div>
                  <div className="text-base font-semibold">
                    {formatPrice(product.price * Math.max(1, qty))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-neutral-600">No product selected.</div>
          )}
        </div>

        {/* Payment section */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="mb-4 text-sm font-medium text-neutral-800">Payment</div>
          <PaymentForm />
          <div className="mt-4">
            <div className="mb-2 text-xs font-medium text-neutral-500">We accept</div>
            <div className="flex flex-wrap items-center gap-3">
              <Image src="/icons/visa.png" alt="Visa" width={40} height={20} className="h-5 w-auto" />
              <Image src="/icons/stripe.png" alt="Stripe" width={48} height={20} className="h-5 w-auto" />
              <Image src="/icons/tngo.png" alt="Touch 'n Go" width={48} height={20} className="h-5 w-auto" />
              <Image src="/icons/duitnow.png" alt="DuitNow" width={48} height={20} className="h-5 w-auto" />
              <Image src="/icons/cards.png" alt="Credit Cards" width={48} height={20} className="h-5 w-auto" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
