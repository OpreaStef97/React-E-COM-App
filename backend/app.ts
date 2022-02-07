import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
import mongoSanitize from 'express-mongo-sanitize';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import expressLimiter from 'express-rate-limit';

import productsRouter from './src/routes/products-route';
import AppError from './src/models/error-model';
import globalErrorHandler from './src/controllers/error-controller';

dotenv.config({ path: './config.env' });
const app = express();

// APP
/////////////////////////////////////

(async () => {
    app.use(bodyParser.json());

    app.use(
        '/api',
        expressLimiter({
            max: 5000,
            windowMs: 60 * 60 * 1000,
            message: 'Too many requests from this IP, please try again in an hour',
        })
    );

    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    }

    // Setting CORS
    app.use(cors());

    // Setting CSP
    app.use(
        helmet({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'", 'https:', 'http://localhost:3000'],
                    fontSrc: ["'self'", 'https:'],
                    scriptSrc: ["'self'", 'https://*.stripe.com'],
                    styleSrc: ["'self'", "'unsafe-inline'", 'https:'],
                },
            },
            crossOriginResourcePolicy: { policy: 'cross-origin' },
        })
    );

    // Data sanitization for NoSQL
    app.use(mongoSanitize());

    // Serving static files
    app.use('/images', express.static(path.join(__dirname, 'public/images')));

    // ROUTES
    /////////////////////////////////////

    app.use('/api/products', productsRouter);

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
