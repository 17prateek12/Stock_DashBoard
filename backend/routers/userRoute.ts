import express from 'express';
import { registeruser, loginuser,logoutUser, currentuser} from '../controller/userController';
import validateToken from '../middleware/protect';

const router = express.Router();

router.route('/register').post(registeruser);

router.route('/login').post(loginuser);

router.route('/logout').post(logoutUser);

router.route('/current').get(validateToken , currentuser);

export default router;
