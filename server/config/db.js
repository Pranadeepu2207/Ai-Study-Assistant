import mongoose from "mongoose";

const connectDb = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI)  // connects mongoDB Atlas Asyncronously
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    }catch(error){
        console.log(`MongoDB Error: ${error.message}`)
        process.exit(1) // exits the process with failure code, so the server doesnt run without databse
    }
}

export default connectDb