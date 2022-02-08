import { Document } from 'mongoose';

export default interface UserDoc extends Document {
    id: string;
    name: string;
    email: string;
    photo: string;
    role: string;
    password: string;
    passwordConfirm?: string;
    passwordChangedAt?: Date;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    active: boolean;
    correctPassword: (candidatePassword: string, userPassword: string) => Promise<boolean>;
    changedPasswordAfter: (JWTTimeStamp?: number) => boolean;
    _doc: UserDoc;
}
