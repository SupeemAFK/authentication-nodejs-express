const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    name: {
        type: String,
        default: ''
    },
    bio: { 
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: "https://storage.googleapis.com/social-app-files-bucket/profile-image-placeholder.png"
    },
    banner: {
        type: String,
        default: "https://storage.googleapis.com/social-app-files-bucket/placeholder-16-9.jpg"
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otpSecret: {
        type: String,
    },
    lastSignedIn: {
        type: Date,
        default: () => new Date()
    },
    createdAt: {
        type: Date,
        default: () => new Date(),
    }
})

const userModel = mongoose.model('User', userSchema)
module.exports = userModel