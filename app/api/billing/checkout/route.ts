import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const body = (await request.json()) as { priceId: string };
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: body.priceId, quantity: 1 }],
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/",
  });

  return Response.json({ id: session.id });
}
