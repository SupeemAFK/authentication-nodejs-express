const speakeasy = require("speakeasy");
const QRCode = require('qrcode')
const UserModel = require('../models/user');
const bcrypt = require('bcrypt');

async function generateOtpSecret(req, res) {
    const user = await UserModel.findById(req.user.id)
    const password = req.body.password

    if (user.two_factor_enabled) {
        return res.status(401).json({ message: "Already activate 2FA" })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" })
    }

    const secret = speakeasy.generateSecret()
    user.two_factor_temp_secret = secret
    await user.save()

    QRCode.toDataURL(secret.otpauth_url, (err, data_url) => {
        if (err) return res.status(400).json({ message: err })
        return res.status(200).json({ data_url })
    })
}

async function enable2FA(req, res) {
    const user = await UserModel.findById(req.user.id)
    const token = req.body.token
    const base32secret = user.two_factor_temp_secret.base32;
    const verified = speakeasy.totp.verify({ 
        secret: base32secret,
        encoding: 'base32',
        token: token 
    });
    if (!verified) {
        return res.status(400).json({ message: "Invalid token" })
    }

    user.two_factor_secret = user.two_factor_temp_secret;
    user.two_factor_enabled = true
    user.two_factor_temp_secret = undefined; //unset "two_factor_temp_secret" field
    await user.save()
    return res.status(200).json({ message: "2fa has been enabled!" })
}

async function verifyToken(req, res) {
    const { credentials, token } = req.body
    const user = await UserModel.findOne({$or: [{ email: credentials },{ username: credentials }]})

    const base32secret = user.two_factor_secret.base32;
    const verified = speakeasy.totp.verify({ 
        secret: base32secret,
        encoding: 'base32',
        token: token 
    });
    
    if (!verified) {
        return res.status(400).json({ message: "Invalid token" })
    }

    return req.logIn(user, () => res.status(200).json({ message: "Successfully signin" }))
}

async function invalidateSecret(req, res) {
    const user = await UserModel.findById(req.user.id)
    const password = req.body.password

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" })
    }

    user.two_factor_secret = undefined; //unset "two_factor_temp_secret" field
    user.two_factor_enabled = false;
    await user.save()
    return res.status(200).json({ message: "Success" })
}

module.exports = { 
    generateOtpSecret,
    enable2FA,
    verifyToken,
    invalidateSecret, 
}