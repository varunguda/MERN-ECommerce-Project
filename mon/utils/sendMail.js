import nodemailer from "nodemailer";
import catchAsync from "./catchAsync.js";

export const sendEmail = catchAsync( async(object) => {
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
} )

