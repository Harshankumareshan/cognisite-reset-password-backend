import mongoose from "mongoose";

export function dbConnection(){
    const params = {
        useNewUrlParser:true,
        useUnifiedTopology:true,
    }
    try {
        mongoose.connect("mongodb+srv://root:root123@cluster0.io16uyv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",params)
        console.log("Database connected Succesfully")
    } catch (error) {
        console.log("Error connecting DB")
    }
}