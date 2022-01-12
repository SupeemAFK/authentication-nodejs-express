const express = require('express');
const passport = require('passport');
const { 
    signin, 
    signup, 
    oauthSignin, 
    signout, 
    forgotPassword, 
    resetPassword, 
    verifyEmail, 
    sendVerifyEmail, 
    changeEmail, 
    changePassword } = require('../controllers/auth')
    
const {
    generateOtpSecret,
    enable2FA,
    verifyToken,
    invalidateSecret, } = require('../controllers/totp')

const router = express.Router();

router.post('/signin', signin)
router.post('/signup', signup)
router.post("/signout", signout);
router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
router.get('/google/callback', oauthSignin);

router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

router.post('/send-verify-email', sendVerifyEmail)
router.post('/verify-email', verifyEmail)

router.post('/change-email', changeEmail)
router.post('/change-password', changePassword)

router.post('/generate-otp-secret', generateOtpSecret)
router.post('/enable-2FA', enable2FA)
router.post('/verify-token', verifyToken)
router.post('/deactivate-2FA', invalidateSecret)

module.exports = router