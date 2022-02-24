import HandlerFactory from '../api/handler-factory';
import Cart from '../models/cart-model';
import AppError from '../models/error-model';
import catchAsync from '../utils/catch-async';

const factory = new HandlerFactory(Cart);

export const createOrPutCart = catchAsync(async function (req, res, next) {
    if (!req.user.id) {
        return next(new AppError(401, 'Please authenticate to perform this action'));
    }

    const cart = await Cart.findOne({ user: req.user.id });

    delete req.body.totalAmount;
    delete req.body.totalQuantity;
    req.body.user = req.user.id;

    if (!cart) {
        factory.createOne()(req, res, next);
    } else {
        const updatedCart = await Cart.findByIdAndUpdate(cart.id, { ...req.body }, { new: true });

        if (!updatedCart) {
            return new AppError(404, 'Document not found');
        }

        res.status(200).json({
            status: 'success',
            updatedCart,
        });
    }
});

export const getAllCarts = factory.getAll();

// admin routes
export const getOneCart = factory.getOne();
export const createOneCart = factory.createOne();
export const deleteOneCart = factory.deleteOne();
