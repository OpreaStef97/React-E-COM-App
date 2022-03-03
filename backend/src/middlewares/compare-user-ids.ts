import { NextFunction, Request, Response } from 'express';
import AppError from '../models/error-model';

export const compareUserIds = (req: Request, res: Response, next: NextFunction) => {
    if (req.params.uid !== req.user.id) {
        return next(new AppError(403, 'You are not allowed to get this data'));
    }

    next();
};
