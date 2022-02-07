import { Handler, NextFunction, Request, Response } from 'express';

const catchAsync = (fn: Handler) => (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
};

export default catchAsync;
