import dotenv from 'dotenv'

import connnectDB from "./db/index.js";

dotenv.config({ path: './.env' })

connnectDB()



// import mongoose from "mongoose";
// import DB_Name from './constants'
// import express from "express"

// const app = express()

// ;(async ()=>{
//     try{
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_Name}`)

//         app.on("error", (error)=>{
//             console.log("Error: ", error)
//             throw error
//         })

//         app.listen(process.env.PORT, ()=>{
//             console.log(`app is listening on port ${process.env.PORT}`)
//         })

//     }catch(error){
//         console.log('Error : ', error)
//     }
// })()