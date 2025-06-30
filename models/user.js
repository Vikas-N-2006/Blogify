const { Schema, model } = require('mongoose');
const { createHmac, randomBytes } = require('crypto');
const { generateToken, verifyToken } = require('../services/auth');
require('dotenv').config();

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    profileImageURL: {
        type: String,
        default: "/images/default.png",
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    }
},
    { timestamps: true }
);

userSchema.pre("save", function (next) {
    const user = this;
    if (!user.isModified("password")) {
        return;
    }
    const salt = randomBytes(16).toString();
    const hashedPass = createHmac("sha256", salt)
        .update(user.password)
        .digest("hex");

    this.salt = salt;
    this.password = hashedPass;
    next();
});


userSchema.static("matchPassAndGenerateToken", async function (email, password) {
    const user = await User.findOne({ email });

    if (!user) throw new Error("User not found!!");

    const hashedPass = user.password;

    const userHash = createHmac("sha256", user.salt)
        .update(password)
        .digest("hex");

    if (userHash !== hashedPass) throw new Error("Invalid password!!");

    const token = generateToken(user);
    return token;
})

const User = model('User', userSchema);

module.exports = User;