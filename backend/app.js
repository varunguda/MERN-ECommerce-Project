import express from 'express';
import productRoute from './routes/productRoutes.js';
import userRoute from './routes/userRoutes.js';
import adminRoute from './routes/adminRoutes.js';
import orderRoute from "./routes/orderRoutes.js";
import { ErrorHandler } from './utils/errorHandler.js';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import session from 'express-session';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';


config({
    path: "./config/config.env"
})


const app = express();


// Using middleware
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());


// Using routes
app.use('/api/v1', adminRoute)
app.use('/api/v1', userRoute)
app.use('/api/v1', productRoute)
app.use("/api/v1", orderRoute)


// Error Handling
app.use((err, req, res, next) => {

    err.status = err.status || 500
    err.message = err.message || "Internal server error!"

    if (err.name === "CastError") {
        err = new ErrorHandler(`Resource not found! Invalid: ${err.path}`, 400)
    }

    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered!`;
        err = new ErrorHandler(message, 400);
    }

    if (err.name === "JsonWebTokenError") {
        const message = `Json Web Token is invalid, Please try again `;
        err = new ErrorHandler(message, 400);
    }

    if (err.name === "TokenExpiredError") {
        const message = `Json Web Token is Expired, Try again `;
        err = new ErrorHandler(message, 400);
    }

    return res
        .status(err.status)
        .json({
            success: false,
            message: err.message
        })
})


export default app