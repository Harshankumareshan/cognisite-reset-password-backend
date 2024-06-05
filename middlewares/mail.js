import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

const sendMail = async (options) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER, // Use environment variable for Gmail user
                pass: process.env.GMAIL_PASS, // Use environment variable for Gmail password
            },
        });

        const mailOptions = {
            from: process.env.GMAIL_USER, // Use environment variable for sender email
            to: options.email,
            subject: 'Password Reset',
            text: options.message
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
        return { success: true, message: 'Email sent successfully' };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error: 'Failed to send email' };
    }
};

export default sendMail;
