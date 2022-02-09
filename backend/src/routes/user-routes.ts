import express from 'express';
import {
    isLoggedIn,
    login,
    logout,
    protect,
    signUp,
    updatePassword,
} from '../controllers/auth-controller';
import { getAllUsers } from '../controllers/user-controller';

const router = express.Router();

router.get('/', getAllUsers);

// AUTH
router.post('/signup', signUp);
router.post('/login', login);

router.post('/is-logged-in', isLoggedIn);
router.get('/logout', logout);

router.use(protect);

router.patch('/update-password', updatePassword);

export default router;
