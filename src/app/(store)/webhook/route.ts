// /home/princekaf/shopper/src/app/(store)/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { Metadata } from "../../../../actions/createCheckoutSession";
import stripe from "@/lib/stripe";
import { backendClient } from "@/sanity/lib/backendClient";


export const config = {
    api: {
        bodyParser: false, // Disable automatic body parsing
    },
};

export async function POST(req: NextRequest) {
    const body = await req.text();
    const headersList = await headers();
    const sig = headersList.get("stripe-signature");
    console.log("Received stripe-signature:", sig);




    if (!sig) {
        return NextResponse.json({ error: "no signature" }, { status: 400 });
    }

    

    // const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const webhookSecret =  "whsec_ddd3cee7356fe1f9696fb502abef2d088d5a54bb45a8cf4f68559186830367f2"
    if (!webhookSecret) {
        console.log("Stripe webhook secret is not set");
        return NextResponse.json({ error: "invalid signature" }, { status: 400 });
    }

    let event: Stripe.Event;
    try {
        event = Stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error validating webhook signature:", error);
            return NextResponse.json({ error: `invalid signature: ${error.message}` }, { status: 400 });
        } else {
            console.error("Unknown error occurred:", error);
            return NextResponse.json({ error: "Unknown error" }, { status: 400 });
        }
    }

    
    //  console.log("Received headers:", headersList);
    //   console.log("Raw body:", body);
    // console.log("Stripe event type:", event.type);

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(`Checkout session completed: ${session.id}`);
    
        try {
            const order = await createOrderInSanity(session);
            console.log(`Order created in Sanity:`, order);
        } catch (error: unknown) {
            // Check if the error is an instance of Error
            if (error instanceof Error) {
                console.error("Error creating order in Sanity:", error);
                return NextResponse.json({ error: `Error creating order: ${error.message}` }, { status: 500 });
            } else {
                // Handle unexpected error types
                console.error("Unknown error occurred:", error);
                return NextResponse.json({ error: "Unknown error" }, { status: 500 });
            }
        }
    }
    
    return NextResponse.json({ received: true });  
}

async function createOrderInSanity(session: Stripe.Checkout.Session) {
    const {
        id,
        amount_total,
        currency,
        metadata,
        payment_intent,
        customer,
        total_details,
    } = session;

    const { orderNumber, customerName, customerEmail, clerkUserId } = metadata as Metadata;

    if (!orderNumber || !customerName || !customerEmail || !clerkUserId) {
        throw new Error("Missing required metadata fields");
    }

    const lineItemWithProduct = await stripe.checkout.sessions.listLineItems(id, { expand: ['data.price.product'] });

    const sanityProducts = lineItemWithProduct.data.map((item) => ({
        _key: crypto.randomUUID(),
        product: {
            _type: 'reference', // Corrected typo
            _ref: (item.price?.product as Stripe.Product)?.metadata?.id,
        },
        quantity: item.quantity || 0,
    }));

    const order = await backendClient.create({
        _type: 'order',
        orderNumber,
        stripeCheckoutSessionId: id,
        stripePaymentIntentId: payment_intent,
        customerName,
        stripeCustomerId: customer,
        clerkUserId: clerkUserId,
        email: customerEmail,
        currency,
        amountDiscount: total_details?.amount_discount ? total_details.amount_discount / 100 : 0,
        products: sanityProducts,
        totalPrice: amount_total ? amount_total / 100 : 0,
        status: 'paid',
        orderDate: new Date().toISOString(),
    });

    return order;
}









