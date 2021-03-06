import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import expressLimiter from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import hpp from 'hpp';
import csrf from 'csurf';

const xssClean = require('xss-clean');

import productsRouter from './src/routes/product-routes';
import usersRouter from './src/routes/user-routes';
import reviewsRouter from './src/routes/review-routes';
import purchasesRouter from './src/routes/purchase-routes';
import cartRouter from './src/routes/cart-routes';

import AppError from './src/models/error-model';
import globalErrorHandler from './src/controllers/error-controller';
import { webHookEventListener } from './src/controllers/purchase-controller';

dotenv.config({ path: './config.env' });
const app = express();

// APP
/////////////////////////////////////

process.on('uncaughtException', err => {
    console.log(err.name, err.message);
    console.log('UNCAUGHT EXCEPTION! 🚨🚨🚨 Shutting down...');
    process.exit(1);
});

(async () => {
    // Setting CSP
    app.use(
        helmet({
            // contentSecurityPolicy: {
            //     directives: {
            //         defaultSrc: ["'self'", 'https://*.stripe.com'],
            //         scriptSrc: ["'self'", 'https://*.stripe.com'],
            //     },
            // },
            crossOriginResourcePolicy: { policy: 'cross-origin' },
            // crossOriginEmbedderPolicy: false,
        })
    );

    // Setting CORS
    app.use(
        cors({
            credentials: true,
            origin: [
                'http://localhost:3000',
                'http://192.168.100.32:3000',
                'https://reactecom-stef.web.app',
                'https://*.stripe.com',
            ],
            allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token', 'stripe-signature'],
        })
    );

    app.use((req, res, next) => {
        if (req.originalUrl === '/api/webhook') {
            return next();
        }
        express.json({ limit: '10kb' })(req, res, next);
    });

    app.use(express.urlencoded({ extended: true, limit: '10kb' }));
    app.use(cookieParser());

    app.use(
        '/api',
        expressLimiter({
            max: 5000,
            windowMs: 60 * 60 * 1000,
            message: 'Too many reqs from this IP, please try again in an hour',
        })
    );

    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    }

    // Sanitize XSS
    app.use(xssClean());

    // Data sanitization for NoSQL
    app.use(mongoSanitize());

    // Prevent parameter polution
    app.use(
        hpp({
            whitelist: ['category', 'type', 'brand', 'default[RAM]', 'default[storage]', '_id'],
        })
    );

    app.post('/api/webhook', express.raw({ type: 'application/json' }), webHookEventListener);

    const csrfProtection = csrf({
        cookie:
            process.env.NODE_ENV === 'production'
                ? {
                      sameSite: 'none',
                      secure: true,
                  }
                : true,
    });

    app.use(csrfProtection);

    app.get('/api/csrf', (req, res) => {
        // Pass the Csrf Token
        res.json({
            csrfToken: req.csrfToken(),
        });
    });

    // Serving static files
    app.use(express.static(path.join('public')));

    // ROUTES
    ////////////////////////////////////
    app.use('/api/products', productsRouter);
    app.use('/api/carts', cartRouter);
    app.use('/api/users', usersRouter);
    app.use('/api/reviews', reviewsRouter);
    app.use('/api/payments', purchasesRouter);

    // app.use((req, res) => {
    //     res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
    // });

    app.all('*', (req, res, next) => {
        next(new AppError(404, `Can't find ${req.originalUrl} on this server`));
    });

    app.use(globalErrorHandler);

    // DB CONNECTION
    /////////////////////////////////////

    const DB_PASSWORD = process.env.DATABASE_PASSWORD;
    const DB_USERNAME = process.env.USERNAME_DB;
    const DB_CONNECT = process.env.DATABASE;

    if (!DB_PASSWORD || !DB_USERNAME || !DB_CONNECT) {
        throw new Error(`Can't connect to database`);
    }

    const DB = DB_CONNECT.replace('<PASSWORD>', encodeURIComponent(DB_PASSWORD)).replace(
        '<USERNAME>',
        DB_USERNAME
    );

    await mongoose.connect(DB);

    console.log('DB connection succesfull!');

    // SERVER
    ///////////////////////////////////////
    const port = process.env.PORT || 5000;
    const server = app.listen(port, () => {
        console.log(`Listening to port ${port}..`);
    });

    // CLOSE SERVER ON UNHANDLED REJECTION
    ///////////////////////////////////////
    process.on('unhandledRejection', err => {
        console.log(err);
        console.log('UNHANDLED REJECTION! 🚨🚨🚨 Shutting down...');
        server.close(() => {
            process.exit(1);
        });
    });
})();
