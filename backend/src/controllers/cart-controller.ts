import HandlerFactory from '../api/handler-factory';
import Cart from '../models/cart-model';
import catchAsync from '../utils/catch-async';

const factory = new HandlerFactory(Cart);

export const cartProcessing = (products: any) => {
    const mapProducts = new Map<string, number>();

    for (const item of products) {
        if (!mapProducts.has(item.product)) {
            mapProducts.set(item.product, item.quantity);
            continue;
        }
        mapProducts.set(item.product, mapProducts.get(item.product) + item.quantity);
    }

    return Array.from(mapProducts).map(([product, quantity]) => ({
        product,
        quantity,
    }));
};

export const putCart = catchAsync(async function (req, res) {
    let cart = await Cart.findOne({ user: req.user.id });

    const { products } = req.body;

    if (!cart) {
        cart = new Cart();
    }

    cart.products = cartProcessing(products);
    cart.user = req.user.id;
    cart.modifiedAt = new Date(Date.now());

    await cart.save();

    res.status(200).json({
        status: 'success',
        cart,
    });
});

export const getAllCarts = factory.getAll({});

// admin routes
export const getOneCart = factory.getOne();
export const createOneCart = factory.createOne();
export const deleteOneCart = factory.deleteOne();
