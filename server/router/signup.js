import express from 'express';
import { SignupController } from '../controller/signupController.js';

const router = express.Router();

// Define CRUD routes for signups
router.get('/', SignupController.getAllSignups);
router.get('/:id', SignupController.getSignupById);
router.post('/', SignupController.createSignup);
router.put('/:id', SignupController.updateSignup);
router.delete('/:id', SignupController.deleteSignup);

export default router;
