import catchAsync from '../utils/catch-async';
import Stripe from 'stripe';
import AppError from '../models/error-model';
import { NextFunction, Request, Response } from 'express';
import Purchase from '../models/purchase-model';
import HandlerFactory from '../api/handler-factory';
import sleep from '../utils/sleep';
import Cart from '../models/cart-model';
import { cartProcessing } from './cart-controller';

const createNewPurchase = async (userId: string) => {
    try {
        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            throw new Error('Something went wrong with cart data');
        }

        const purchase = new Purchase({
            user: userId,
            products: cart.products,
            paid: true,
            paidAt: new Date(Date.now()),
            totalAmount: cart.totalAmount,
        });

        await purchase.save();
        cart.products = [];
        await cart.save();
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
    const { products } = req.body;
    const { id: userId } = req.user;

    if (!products || !(products instanceof Array) || products.length === 0) {
        return next(new AppError(400, 'Please provide a product to create a payment intent'));
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
        cart = new Cart();
    }

    cart.products = cartProcessing(products);
    cart.user = req.user.id;
    cart.modifiedAt = new Date(Date.now());

    await cart.save();

    if (!process.env.STRIPE_SECRET_KEY) {
        return next(new AppError(500, 'Something went wrong'));
    }
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2020-08-27' });

    const { totalAmount } = cart;

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
        amount: totalAmount,
        currency: 'usd',
        automatic_payment_methods: {
            enabled: true,
        },
        metadata: { userId },
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

    const paymentIntent = event.data.object;
    switch (event.type) {
        case 'payment_intent.succeeded':
            createNewPurchase(paymentIntent.metadata.userId);
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
