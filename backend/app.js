import express from 'express';
import productRoute from './routes/productRoutes.js';
import userRoute from './routes/userRoutes.js';
import adminRoute from './routes/adminRoutes.js';
import sellerRoute from './routes/sellerRoutes.js';
import orderRoute from "./routes/orderRoutes.js";
import paymentRoute from "./routes/paymentRoutes.js";
import { ErrorHandler } from './utils/errorHandler.js';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import session from 'express-session';
import fileUpload from 'express-fileupload';
import cors from "cors";


config({
    path: "./config/config.env"
});


const app = express();


// Using middleware
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));
app.use(express.json({ limit: "150mb" }));
app.use(express.urlencoded({
    extended: true,
    limit: '150mb',
    parameterLimit: 50000
}));
app.use(fileUpload({
    limits: { fileSize: 150 * 1024 * 1024 }
}));
app.use(cors({
    origin: process.env.FRONTEND_URL.split(","),
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
}));


// Using routes
app.use('/api/v1', adminRoute);
app.use('/api/v1', sellerRoute);
app.use('/api/v1', userRoute);
app.use('/api/v1', productRoute);
app.use("/api/v1", orderRoute);
app.use("/api/v1", paymentRoute);


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
});


export default app;