import express from 'express';
import {
    isLoggedIn,
    login,
    logout,
    protect,
    restrictTo,
    signUp,
    updatePassword,
} from '../controllers/auth-controller';
import {
    createUser,
    deleteMe,
    deleteUser,
    getAllUsers,
    getUser,
    putFavorite,
    updateMe,
    updateUser,
} from '../controllers/user-controller';
import fileUpload from '../middlewares/file-upload';
import { resizePhoto } from '../middlewares/resize-photo';

const router = express.Router();

router.get('/', getAllUsers);

// AUTH
router.post('/signup', signUp);
router.post('/login', login);
router.post('/is-logged-in', isLoggedIn);
router.get('/logout', logout);

router.use(protect);

router.put('/favorites', putFavorite);
router.patch('/update-password', updatePassword);
router.patch('/update-me', fileUpload.single('photo'), resizePhoto, updateMe);
router.delete('/delete-me', deleteMe);

router.use(restrictTo('admin'));

router.route('/').post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default router;
