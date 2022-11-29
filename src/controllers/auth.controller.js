const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const { generateAccessToken } = require('../helpers/generateToken');
class authController {
    static async register(ctx, next) {
        const { username, email } = ctx.request.body;
        try {
            const user = await User.findOne({ email });
            if (user) {
                ctx.response.status = 400;
                ctx.body = { message: 'Email already in use' };
                return;
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(
                ctx.request.body.password,
                salt,
            );
            const newUser = new User({
                username,
                email,
                password: hashedPassword,
            });
            const savedUser = await newUser.save();
            const { password, ...info } = savedUser._doc;
            ctx.response.status = 201;
            ctx.body = info;
            return;
        } catch (error) {
            ctx.response.status = 500;
            ctx.body = { message: error.message };
            return;
        }
    }
    static async login(ctx, next) {
        const { email } = ctx.request.body;
        try {
            const user = await User.findOne({ email });
            if (!user) {
                ctx.response.status = 404;
                ctx.body = { message: 'Email is not registered' };
                return;
            }
            const isValidPassword = await bcrypt.compare(
                ctx.request.body.password,
                user.password,
            );
            if (!isValidPassword) {
                ctx.response.status = 400;
                ctx.body = { message: 'Invalid password' };
                return;
            }
            const { password, ...info } = user._doc;
            const accessToken = generateAccessToken(info);
            ctx.response.status = 200;
            ctx.body = { ...info, accessToken };
            return;
        } catch (error) {
            ctx.response.status = 500;
            ctx.body = { message: error.message };
            return;
        }
    }
}

module.exports = authController;
