import User from '../models/user-model';
import APIFeatures from '../utils/api-features';
import catchAsync from '../utils/catch-async';

export const getAllUsers = catchAsync(async (req, res) => {
    const features = new APIFeatures(User.find().select('name photo id') /*returns query obj*/, req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const users = await features.query;

    res.status(200).json({
        status: 'success',
        users,
    });
});
