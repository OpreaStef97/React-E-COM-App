import { NextFunction, Request, Response } from 'express';
import UserDoc from '../interfaces/user-interface';
import AppError from '../models/error-model';
import User from '../models/user-model';
import { signAsyncJWT, verifyAsyncJWT } from '../utils/async-jwt';
import catchAsync from '../utils/catch-async';

const createToken = async (user: UserDoc, req: Request) => {
    if (
        !user.id ||
        !process.env.JWT_SECRET ||
        !process.env.JWT_EXPIRES_IN ||
        !process.env.JWT_COOKIE_EXPIRES_IN
    )
        throw new AppError(500, 'Something went very wrong');

    const { id } = user;
    const token = await signAsyncJWT({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });

    const cookieOptions: { [key: string]: string | boolean | number | Date } = {
        expires: new Date(Date.now() + +process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true,
        // identifying the protocol
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    };

    if (process.env.NODE_ENV === 'production') {
        cookieOptions.secure = true;
    }

    return { token, cookieOptions };
};

export const signUp = catchAsync(async (req, res) => {
    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt,
    });

    const sess = await User.startSession();
    sess.startTransaction();
    await newUser.save({ session: sess });
    const { token, cookieOptions } = await createToken(newUser, req);
    await sess.commitTransaction();
    await sess.endSession();

    const resultUser = { ...newUser._doc, password: undefined };
    res.cookie('jwt', token, cookieOptions)
        .status(201)
        .json({
            status: 'success',
            token,
            data: {
                user: resultUser,
            },
        });
});

export const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
        return next(new AppError(400, 'Please provide email and password'));
    }

    // 2) Check if user exitst && password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !user.password || !(await user.correctPassword(password, user.password))) {
        return next(new AppError(401, 'Incorrect email or password'));
    }

    // 3) If everything ok, send token to client
    const { token, cookieOptions } = await createToken(user, req);

    const resultUser = { ...user._doc, password: undefined };

    res.cookie('jwt', token, cookieOptions)
        .status(200)
        .json({
            status: 'success',
            token,
            data: {
                user: resultUser,
            },
        });
});

export const logout = (req: Request, res: Response) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });

    res.status(200).json({ status: 'success' });
};

export const protect = catchAsync(async (req, res, next) => {
    // 1) Getting token and check if it's there
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
        token = req.headers.authorization.split(' ')[1];
    else if (req.cookies.jwt) token = req.cookies.jwt;

    if (!token) {
        return next(new AppError(401, 'You are not logged in! Please log in to get access'));
    }

    if (!process.env.JWT_SECRET) {
        return next(new AppError(500, 'Something went wrong'));
    }

    // 2) Verification token
    const decoded = await verifyAsyncJWT(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(new AppError(401, 'The user belonging to the token no longer exists'));
    }

    // 4) Check if user changed password after the JWT was created
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError(401, 'User recently changed password! Please log in again.'));
    }

    // 5) Grant access by attaching userData to req object to be used in next middlewares
    req.user = currentUser;
    next();
});

export const restrictTo = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // roles ['admin', 'user']. role = 'user'
        if (!roles.includes(req.user.role)) {
            return next(new AppError(403, 'You do not have permission to perform this action'));
        }
        next();
    };
};

export const updatePassword = catchAsync(async (req, res, next) => {
    // 1) Get user from collection
    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
        return next(new AppError(500, 'User logged out or something else happened'));
    }

    // 2) Check if POSTed current password is correct
    if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
        return next(new AppError(401, 'Your current password is wrong'));
    }

    // 3) If so, update password
    const session = await User.startSession();
    session.startTransaction();

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    const { token, cookieOptions } = await createToken(user, req);

    await session.commitTransaction();
    session.endSession();
    
    const resultUser = { ...user._doc, password: undefined };

    res.cookie('jwt', token, cookieOptions)
        .status(200)
        .json({
            status: 'success',
            token,
            data: {
                user: resultUser,
            },
        });
});
