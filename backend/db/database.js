import mongoose from "mongoose";

const connectToDB = () => {
    mongoose.connect(process.env.MONGO_URI, {
        dbName: "E-Commerce"
    }).then(()=>{
        console.log("Database connection established successfully!");
    })
}

export default connectToDB;