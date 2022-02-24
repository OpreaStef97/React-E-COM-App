import AppError from '../models/error-model';
import { signAsyncJWT } from './async-jwt';

export default async function createToken(id: string) {
    if (
        !process.env.JWT_SECRET ||
        !process.env.JWT_EXPIRES_IN ||
        !process.env.JWT_COOKIE_EXPIRES_IN
    )
        throw new AppError(500, 'Something went very wrong');
    const token = await signAsyncJWT({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
    const cookieOptions: { [key: string]: string | boolean | number | Date } = {
        expires: new Date(Date.now() + +process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: true,
        sameSite: 'none',
    };

    return { token, cookieOptions };
}
