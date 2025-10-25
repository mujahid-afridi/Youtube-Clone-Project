import mongoose from "mongoose";
import {DB_Name} from '../constants.js'

const connnectDB = async () => {
    try{
        const connectingInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_Name}`)

        console.log(`\n connection instance || MongoDB connected Host = ${connectingInstance.connection.host}`)
    }catch(error){
        console.log('Mongo DB connection failed : ',error)
        process.exit(1)
    }
}

export default connnectDB