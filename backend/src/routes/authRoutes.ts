import { Router } from 'express';
import {
  signUp,
  logIn,
  getState,
  logOut
} from '../controllers/authController';

const router = Router();

router.post('/signup', signUp);
router.post('/login', logIn);
router.get("/me", getState);
router.post('/logout', logOut);
export default router;
