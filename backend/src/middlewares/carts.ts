import Cart from '../models/cart-model';
import User from '../models/user-model';
import catchAsync from '../utils/catch-async';

export const createCarts = catchAsync(async (req, res) => {
    const users = await User.find();

    const carts = await Promise.all(
        users.map(async user => {
            return await Cart.create({
                user: user.id,
                products: [],
            });
        })
    );

    res.json({
        carts,
    });
});
