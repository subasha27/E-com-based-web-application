import express from 'express';
import passport from '../helpers/passport'; // Import your passport configuration
import * as userController from '../controller/userController';

const router = express.Router();


router.get('/sign/auth/google',passport.authenticate('google', {scope: ['email', 'profile'],}));

// Auth Callback
router.get('/sign/auth/google/callback',passport.authenticate('google', {
successRedirect: '/sign/auth/google/callback/success',
    failureRedirect: '/sign/auth/google/callback/failure',
  })
);

// Success route
router.get('/sign/auth/google/callback/success', userController.handleSuccessCallback);

// Failure route
router.get('/sign/auth/google/callback/failure', (req, res) => {res.send('Error');});

export default router;
