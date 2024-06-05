import express from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { User, generateJwtToken } from '../userSchema/userSchema.js';
import sendMail from '../middlewares/mail.js';

const router = express.Router();

// User Sign Up
router.post('/signup', async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) return res.status(400).json({ data: "Given email already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });
        await user.save();

        const token = generateJwtToken(user._id);
        res.status(200).json({
            user,
            message: "Successfully signed in",
            token: token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ data: "Internal Server error" });
    }
});

// User Login
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ data: "Invalid User Email or Password" });
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(400).json({ data: "Invalid User Email or Password" });
        }

        const token = generateJwtToken(user._id);
        res.status(200).json({
            user,
            message: "Successfully logged in",
            token: token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ data: "Internal Server error" });
    }
});

// Forget Password
router.post('/forgot/password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordTokenExpire = Date.now() + 30 * 60 * 1000; // 30 minutes
        await user.save();

        const resetUrl = `https://cognisitereset.netlify.app/reset/password/${resetToken}`;
        const message = `Your password reset URL is as follows:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`;

        const emailResult = await sendMail({ email: user.email, message });
        if (!emailResult.success) {
            return res.status(500).json({ error: emailResult.error });
        }

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email}`
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Reset Password
router.post('/reset/password/:token', async (req, res) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    console.log(resetPasswordToken);

    try {
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordTokenExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(404).json({ error: 'Invalid or expired token' });
        }

        if (req.body.password !== req.body.confirmPassword) {
            return res.status(400).json({ error: 'Password does not match' });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpire = undefined;
        await user.save();

        const token = generateJwtToken(user._id);
        res.status(200).json({
            user,
            message: "Password reset successful",
            token: token
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export const userRouter = router;
