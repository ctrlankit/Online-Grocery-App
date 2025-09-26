import transporter from '../config/mail.js';

export const sendMail = (to, subject, text) => {
    const mailOptions = {
        from: process.env.SMTP_USER,
        to,
        subject,
        text,
    };
    return transporter.sendMail(mailOptions);
};