import { NextApiRequest, NextApiResponse } from "next";

import { stripe } from "@/src/api/stripe";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { priceId } = req.body;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: { message: 'Method not allowed.' } });
  }

  if (!priceId) {
    return res.status(400).json({ error: { message: 'Price not found.' } });
  }

  const domainURL = process.env.NEXT_URL;

  const checkoutSession = await stripe.checkout.sessions.create({
    success_url: `${domainURL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${domainURL}/`,
    mode: 'payment',
    line_items: [
      {
        price: priceId,
        quantity: 1,
      }
    ]
  });

  return res.status(200).json({
    checkoutUrl: checkoutSession.url
  });
}
