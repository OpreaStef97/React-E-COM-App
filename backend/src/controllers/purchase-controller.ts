import catchAsync from '../utils/catch-async';
import Stripe from 'stripe';
import AppError from '../models/error-model';
import Product from '../models/product-model';
import { NextFunction, Request, Response } from 'express';
import Purchase from '../models/purchase-model';
import HandlerFactory from '../api/handler-factory';
import sleep from '../utils/sleep';

interface Item {
    id: string;
    quantity: number;
}

const newPurchaseSession = async ({
    user,
    products,
}: {
    user: string;
    products: { product: string; quantity: number }[];
}) => {
    let totalAmount = 0;

    await Promise.all(
        products.map(async ({ product, quantity }) => {
            const orderProduct = await Product.findById(product);

            if (!orderProduct)
                throw new AppError(404, 'Could not find the product for the provided ID');

            totalAmount += orderProduct.price * 100 * quantity;
        })
    );

    totalAmount = Math.ceil(totalAmount);

    const purchase = await Purchase.create({
        user,
        products,
        totalAmount,
    });

    return purchase;
};

const commitPurchase = async (orderId: string) => {
    try {
        const purchase = await Purchase.findById(orderId);

        if (!purchase) {
            throw new Error(
                'Purchase was processed by Stripe, but due to some tehnical reason on Stripe API, it expired'
            );
        }

        purchase.paid = true;
        purchase.sessionLifetime = undefined; // persist purchase in DB
        purchase.paidAt = new Date(Date.now());

        await purchase.save();
    } catch (err) {
        console.error(err);
    }
};

const cancelPaymentIntentSession = async (stripe: Stripe, id: string) => {
    await sleep(300); // after 5 minutes of inactivity cancel payment intent session

    try {
        await stripe.paymentIntents.cancel(id);
        console.log('Payment Intent Canceled');
    } catch (err) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const mute = err;
    }
};

export const createPaymentIntent = catchAsync(async (req, res, next) => {
    const { items: cartItems } = req.body;

    if (!cartItems || !(cartItems instanceof Array) || cartItems.length === 0) {
        return next(new AppError(400, 'Please provide an item to create a payment intent'));
    }

    if (cartItems.length > 40) {
        return next(
            new AppError(
                400,
                'Too many items to process. Please contact support/sales for larger orders'
            )
        );
    }

    const items: Item[] = [];

    cartItems.forEach(({ id, quantity }: Item) => {
        if (!id || !quantity || quantity > 10) {
            return next(new AppError(422, 'Corrupted cart data'));
        }
        items.push({
            id,
            quantity,
        });
    });

    if (!process.env.STRIPE_SECRET_KEY) {
        return next(new AppError(500, 'Something went wrong'));
    }
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2020-08-27' });

    const purchase = await newPurchaseSession({
        user: req.user.id,
        products: items.map(({ id, quantity }) => {
            return {
                product: id,
                quantity,
            };
        }),
    });

    const { totalAmount } = purchase;

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
        amount: totalAmount,
        currency: 'usd',
        automatic_payment_methods: {
            enabled: true,
        },
        metadata: {
            orderId: purchase.id,
        },
    });

    cancelPaymentIntentSession(stripe, paymentIntent.id);

    res.status(201).json({
        clientSecret: paymentIntent.client_secret,
    });
});

export const webHookEventListener = (req: Request, res: Response, next: NextFunction) => {
    let event = req.body;

    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
        return next(new AppError(500, 'Something went very wrong'));
    }

    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2020-08-27' });

    if (endpointSecret) {
        const signature = req.headers['stripe-signature'];
        try {
            event = stripe.webhooks.constructEvent(req.body, signature!, endpointSecret);
        } catch (err) {
            console.log(
                `⚠️  Webhook signature verification failed.`,
                err instanceof Error && err.message
            );
            return res.sendStatus(400);
        }
    }

    switch (event.type) {
        case 'payment_intent.succeeded':
            {
                const paymentIntent = event.data.object;
                commitPurchase(paymentIntent.metadata.orderId);
            }
            break;
        default:
            // Unexpected event type
            console.log(`Unhandled event type ${event.type}.`);
    }
    res.send();
};

const factory = new HandlerFactory(Purchase);

export const getAllPurchaseRecords = factory.getAll();
export const getOnePurchaseRecord = factory.getOne();
export const createPurchaseRecord = factory.createOne();
export const updatePurchaseRecord = factory.updateOne();
export const deletePurchaseRecord = factory.deleteOne();
