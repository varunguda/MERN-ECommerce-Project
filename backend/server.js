import { config } from "dotenv"
import app from './app.js';
import connectToDB from "./data/database.js";

config({
    path: "./config/config.env"
})


// Connecting to database
connectToDB();


// Handling Uncaught Exception
process.on("uncaughtException", (err)=>{
    console.log(`Error: ${err}`);
    console.log("Shutting down server due to uncaught exception!");

    server.close(()=>{
        process.exit(1);
    })
})


const server = app.listen(process.env.PORT, ()=>{
    console.log(`Server is listening at http://localhost:${process.env.PORT}/`)
})



// Unhandled promise rejection
process.on("unhandledRejection", (err)=>{
    console.log(`Error: ${err}`);
    console.log("Shutting down the server due to Unhandled Promise Rejection");

    server.close(()=>{
        process.exit(1)
    })
})