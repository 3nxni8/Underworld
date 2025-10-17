import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

function absoluteUrl(req: Request, path: string) {
  try {
    const url = new URL(req.url);
    if (path.startsWith("http")) return path;
    return `${url.protocol}//${url.host}${path}`;
  } catch {
    return path;
  }
}

type CheckoutItem = {
  name: string;
  amount: number;
  quantity: number;
  image?: string;
};

export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }
  const body = await req.json();
  const items = (body?.items ?? []) as CheckoutItem[];

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "No items" }, { status: 400 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: items.map((i) => ({
        price_data: {
          currency: "usd",
          unit_amount: Math.round(i.amount * 100),
          product_data: {
            name: i.name,
            images: i.image ? [absoluteUrl(req, i.image)] : [],
          },
        },
        quantity: Math.max(1, i.quantity || 1),
        adjustable_quantity: { enabled: true, minimum: 1 },
      })),
      success_url: absoluteUrl(req, "/?success=1"),
      cancel_url: absoluteUrl(req, "/cart?canceled=1"),
    });

    return NextResponse.json({ url: session.url });
  } catch (e: unknown) {
    console.error(e);
    const message = e instanceof Error ? e.message : "Stripe error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
