import AppError from '../models/error-model';
import User from '../models/user-model';
import APIFeatures from '../utils/api-features';
import catchAsync from '../utils/catch-async';
import { createOne, deleteOne, getOne, updateOne } from './handler-factory';

const filterObj = (obj: { [key: string]: string }, ...allowedFields: string[]) => {
    const newObj: { [key: string]: string } = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) {
            newObj[el] = obj[el];
        }
    });
    return newObj;
};

export const getAllUsers = catchAsync(async (req, res) => {
    const features = new APIFeatures(
        User.find().select('name photo id') /*returns query obj*/,
        req.query
    )
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

export const getUser = getOne(User);
export const updateUser = updateOne(User);
export const createUser = createOne(User);
export const deleteUser = deleteOne(User);

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
