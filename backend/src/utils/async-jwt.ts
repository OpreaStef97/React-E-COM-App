import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import AppError from '../models/error-model';

export const verifyAsyncJWT = (token: string, secretKey: Secret): Promise<JwtPayload> => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secretKey, (err, decodedToken) => {
            if (err || !decodedToken)
                return reject(err || new AppError(500, 'Something went wrong'));

            return resolve(decodedToken as JwtPayload);
        });
    });
};

export const signAsyncJWT = (
    payload: string | object | Buffer,
    secretKey: Secret,
    options: jwt.SignOptions
): Promise<string> => {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, secretKey, options, (err, token) => {
            if (err || !token) return reject(err || new AppError(500, 'Something went wrong'));
            return resolve(token);
        });
    });
};
