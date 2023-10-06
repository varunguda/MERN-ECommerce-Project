import catchAsync from "./catchAsync.js";
import { sendEmail } from "./sendMail.js";
import { codeGenerator } from './generateCode.js';
import cloudinary from "cloudinary";

export const verifyMail = catchAsync(async (req, res, next) => {

    const myCloud = await cloudinary.v2.uploader.upload( req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
    } )

    const { name, email, password } = req.body;

    // Two approaches I've come up with to Verify a user before creating his account:
    // 1. User enters his details his details are stored in a 'tempusers' collection in the database until his email is verified, and gets added to the Users database once verified
    // 2. His data is temporarily stored in express session until his mail is verified.

    // Also two methods of verifying the mail
    // 1. I send a URL, on which upon clicking, users account get created
    // 2. A confirmation code is sent to the user's mail. This way I wouldn't have to worry about the browser-specific nature of sessions.



    // const mailToken = jwt.sign({
    //     email
    // }, process.env.JWT_SECRET, { expiresIn: '1d' })

    // const verifyEmailURL = `${req.protocol}://${req.get("host")}/api/v1/verified-create/${mailToken}`;

    const code = codeGenerator();

    const codeExpireTime = Date.now() + 15 * 60 * 1000;

    if (req.session.registrationDetails) {
        delete req.session.registrationDetails;
    }

    req.session.registrationDetails = { name, email, password, avatar:{ public_id: myCloud.public_id, url: myCloud.secure_url }, code, codeExpireTime }

    const html = `<html>

    <head>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet">
      <style>
        body {
          font-family: 'Montserrat', sans-serif;
          background-color: #f7f7f7;
          text-align: center;
          margin: 0;
          padding: 0;
        }
    
        .container {
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          max-width: 400px;
          margin: 0 auto;
          padding: 30px;
          text-align: left;
        }
    
        h1 {
          color: #007bff;
          font-size: 28px;
          margin-bottom: 20px;
        }

        h2{
            font-weight: 200;
            font-size: 35px;
        }
    
        p {
          color: #333;
          font-size: 18px;
          line-height: 1.6;
          margin-bottom: 20px;
        }
    
        .verification-code {
          background-color: #f7f7f7;
          padding: 10px;
          border-radius: 4px;
          font-weight: bold;
        }
    
        .important {
          color: #d9534f;
          font-size: 18px;
          margin-top: 30px;
        }
    
        .note {
          color: #777;
          font-size: 14px;
          margin-top: 20px;
        }
      </style>
      </head>
    
      <body>
    
      <div class="container">
        <h1>Verify Your Email</h1>
    
        <p>Thank you for signing up! To activate your ManyIN account, please use the following verification code:</p>


        <h2 class="verification-code">${code}</h2>
    
        <p class="important"><strong>Important:</strong> If you haven't requested for creating this account, please disregard this email.</p>
    
        <p class="note">Note: The verification code is valid only for 15 mins for security reasons.</p>
      </div>
    
      </body>
    
      </html>
    
      `

    sendEmail({
        email,
        subject: "Confirmation code for creating your MANYin account!",
        html
    });

    return res.json({
        success: true,
        message: `A Verification code has been sent to ${email} successfully!`
    })

})
