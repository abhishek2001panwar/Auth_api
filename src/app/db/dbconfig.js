import { Console } from "console";
import mongoose, { connection } from "mongoose";
export async function connect(){
    
   try {
     await mongoose.connect(process.env.MONGO_URI);
     const connection = mongoose.connection;
     connection.on('connected', (error)=>{
        console.log("mongo db connectd", error)
     })
   } catch (error) {
    console.log("something went wrong")
    console.log(error)
   }
}