import express from 'express';
import productRoute from './routes/productRoute.js';
import userRoute from './routes/userRoute.js';
import { ErrorHandler } from './utils/errorHandler.js';
import cookieParser from 'cookie-parser';

const app = express();

// Using middleware
app.use(express.json());
app.use(cookieParser());


// Using routes
app.use('/api/v1', productRoute)
app.use('/api/v1', userRoute)



// Error Handling
app.use((err, req, res, next)=>{

    err.status = err.status || 500
    err.message = err.message || "Internal server error!"

    if(err.name === "CastError"){
        err = new ErrorHandler(`Resource not found! Invalid: ${err.path}`, 400)
    }

    return res
    .status(err.status)
    .json({
        success: false,
        message: err.message
    })
})


export default app