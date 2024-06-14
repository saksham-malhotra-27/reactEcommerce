import multer from "multer"
import { Request, Response, NextFunction } from "express"
import prisma from "../db/prisma.js";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "cloudinary"
/*
export const multerTest = async (req: Request, res: Response, next: NextFunction) =>{
    try{
    const id = req.user.id;
    // add profilepic here and then update the data 
    const file = req.file;
    if(file){
       const fileUri =  getDataUri(file);
       if(fileUri.content){
       const mycloud = await cloudinary.v2.uploader.upload(fileUri.content)
       
       const updatedUser = await prisma.users.update({
        where:{
            id: id,
        }, 
        data:{
            profilePicId: mycloud.public_id,
            profilePicUrl: mycloud.secure_url,
        }, 
        select:{
            profilePicId:true,
            profilePicUrl:true,
            id:true,
            email:true
        }
       })
       return res.status(200).send({
        updatedUser
       })
       }
       else{
        return res.status(403).send("file data corrupt")
       } 
    }
    else{
        return res.status(403).send("Invalid file")
    } 
}
catch(err){
    console.log(err)
}

}*/