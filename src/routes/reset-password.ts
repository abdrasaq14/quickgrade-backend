import express from 'express';
import { resetPassword } from '../controller/reset-password';

const router = express.Router();

router.post('/reset', resetPassword);

export default router;