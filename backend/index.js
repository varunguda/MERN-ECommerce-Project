import { config } from "dotenv"
import app from './app.js';
import connectToDB from "./db/database.js";
import {v2 as cloudinary} from 'cloudinary';
          

config({
    path: "./config/config.env"
});

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


// Connecting to database
connectToDB();


// Handling Uncaught Exception
process.on("uncaughtException", (err)=>{
    console.log(`Error: ${err}`);
    console.log("Shutting down server due to uncaught exception!");

    server.close(()=>{
        process.exit(1);
    })
});


const server = app.listen((process.env.PORT || 5000), ()=>{
    console.log(`Server is listening at PORT:${process.env.PORT || 5000}`)
});


// Unhandled promise rejection
process.on("unhandledRejection", (err)=>{
    console.log(`Error: ${err}`);
    console.log("Shutting down the server due to Unhandled Promise Rejection");

    server.close(()=>{
        process.exit(1);
    })
})