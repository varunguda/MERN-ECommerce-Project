import nodemailer from "nodemailer";

export const sendEmail = async (object) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            service: process.env.SMTP_SERVICE,
            auth: {
                user: process.env.SMTP_MAIL,
                pass: process.env.SMTP_PASS
            }
        });

        const mailOptions = {
            from: process.env.SMTP_MAIL,
            to: object.email,
            subject: object.subject,
            html: object.html
        };

        const mail = await transporter.sendMail(mailOptions);

        return mail;

    } catch (error) {
        console.error(`Failed to send email: ${error}`);
    }
};
