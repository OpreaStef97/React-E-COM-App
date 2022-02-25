import AppError from '../models/error-model';
import User from '../models/user-model';
import catchAsync from '../utils/catch-async';
import HandlerFactory from '../api/handler-factory';
import Favorite from '../models/favorite-model';

const factory = new HandlerFactory(User);

const filterObj = (obj: { [key: string]: string }, ...allowedFields: string[]) => {
    const newObj: { [key: string]: string } = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) {
            newObj[el] = obj[el];
        }
    });
    return newObj;
};

export const getAllUsers = factory.getAll('name photo id');
export const getUser = factory.getOne();
export const updateUser = factory.updateOne();
export const createUser = factory.createOne();
export const deleteUser = factory.deleteOne();

export const updateMe = catchAsync(async (req, res, next) => {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(
            new AppError(
                400,
                'This route is not for password updates. Please use /updateMyPassword route'
            )
        );
    }

    // body.role: 'admin'

    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email');
    if (req.file) filteredBody.photo = req.file.filename;

    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser,
        },
    });
});

export const deleteMe = catchAsync(async (req, res) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
        status: 'success',
        data: null,
    });
});

export const putFavorite = catchAsync(async (req, res) => {
    const { products } = req.body;

    let fav = await Favorite.findOne({ user: req.user.id });

    if (!fav) {
        fav = new Favorite();
    }

    const productSet = new Set<string>(products);

    fav.products = [...productSet];
    fav.user = req.user.id;
    fav.modifiedAt = new Date(Date.now());

    await fav.save();

    res.status(200).json({
        status: 'success',
        fav,
    });
});
