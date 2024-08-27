import express from 'express';
import { registeruser, loginuser,logoutUser} from '../controller/userController';

const router = express.Router();

router.route('/register').post(registeruser);

router.route('/login').post(loginuser);

router.route('/logout').post(logoutUser);

export default router;
