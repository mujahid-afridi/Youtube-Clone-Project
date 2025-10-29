import {v2} from "cloudinary"
import fs from 'fs'
import dotenv from "dotenv"
dotenv.config()

v2.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localpath) =>{
    try{
        if(!localpath) return null;
        const response = await v2.uploader.upload(localpath, {
            resource_type : "auto"
        })
        // console.log("File successully uploaded on cloudinary", response.url)
        fs.unlinkSync(localpath)
        return response
    }catch(error){
        fs.unlinkSync(localpath) //Delete file from localstorage
        console.log("Error occured in cloudinary file = ", error.message)
        return null;
    }
}

export {uploadOnCloudinary}


