import { Document } from 'mongoose';

export default interface UserDoc extends Document {
    name?: string;
    email?: string;
    photo?: string;
    role?: string;
    password?: string;
    passwordConfirm?: string;
    passwordChangedAt?: Date;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    active?: boolean;
}
