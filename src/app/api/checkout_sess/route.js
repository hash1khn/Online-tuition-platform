import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const formatAmountForStripe = (amount) => Math.round(amount * 100); // Simplified

export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;
  const session_id = searchParams.get("session_id");

  try {
    if (!session_id) {
      throw new Error("Session ID is required");
    }

    const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);
    return NextResponse.json(checkoutSession);
  } catch (error) {
    console.error("Error retrieving checkout session:", error);
    return NextResponse.json(
      { error: { message: error.message } },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json(); // Read JSON body from the request
    const { amount } = body; // Assuming frontend sends totalPrice as 'amount'

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: { message: "Invalid amount" } },
        { status: 400 }
      );
    }

    const params = {
      mode: "payment", // This is a one-time payment
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd", // Adjust to your currency
            product_data: {
              name: "Contract Payment", // Adjust as per your product name
            },
            unit_amount: formatAmountForStripe(amount), // Use the amount from the frontend
          },
          quantity: 1,
        },
      ],
      success_url: `/dashboard/user/list/`, // Customize your success URL
      cancel_url: `${req.headers.get(
        "origin"
      )}/result?session_id={CHECKOUT_SESSION_ID}`, // Customize your cancel URL
    };

    const checkoutSession = await stripe.checkout.sessions.create(params);
    return NextResponse.json(checkoutSession, { status: 200 });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: { message: error.message } },
      { status: 500 }
    );
  }
}
