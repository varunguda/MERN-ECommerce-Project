import { config } from "dotenv"
import app from './app.js';
import connectToDB from "./data/database.js";

config({
    path: "./config/config.env"
})

connectToDB();

app.listen(process.env.PORT, ()=>{
    console.log(`Server is listening at http://localhost:${process.env.PORT}/`)
})