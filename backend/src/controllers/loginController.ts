import { Response, Request } from "express"
import jwt from "jsonwebtoken"
import prisma from "../db/prisma.js";
import {z } from "zod"
import dotenv from 'dotenv'
dotenv.config()


const UserRequest = z.object({
    email: z.string().email(),
    password: z.string()
}) 

const UserRequestReg = z.object({
    email: z.string().email(),
    password: z.string(),
    phone: z.string(), 
    role: z.string(),
    location: z.string()
})



export const loginController = async (req: Request, res: Response<string>) => {
   try{
        
       const result = UserRequest.safeParse(req.body)
       if(!result.success){
        const errorMessage = JSON.stringify({ msg: 'Invalid arguments', success: 'false' });
        res.status(403).json(errorMessage);
       }
       else {
       const userData = result.data
       const user = await prisma.users.findFirst({
           where:{
               email: userData.email,
               password: userData.password
            },
            select:{
                id:true,
                email:true, 
                location:true,
                role:true,
                phone:true,
            }
        },
    )
    if(user){
        const token = jwt.sign({...user}, process.env.JWT_SECRET! )
        const Message = JSON.stringify({ msg: 'Logged', success: 'true', token: token });
        res.status(200).json(Message);
    }else{
        const errorMessage = JSON.stringify({ msg: 'Invalid User', success: 'false' });
        res.status(409).json(errorMessage);
    }

    }
    }
    catch(err){
        const errorMessage = JSON.stringify({ msg: String(err), success: 'false' });
        res.status(409).json(errorMessage);
    }

}

export const registerController = async (req: Request, res: Response<string>)=> {
    try{

        const result= UserRequestReg.safeParse(req.body);
        if(!result.success){
            const errorMessage = JSON.stringify({ msg: 'Invalid arguments', success: 'false' });
            res.status(403).json(errorMessage);
        }
        else {
        const userData = result.data
        const user = await prisma.users.findFirst({
            where:{
                email: userData.email
             },
             select:{
                id:true,
                email:true, 
                location:true,
                role:true,
                phone:true,
             }
         },
     )

     if(user){
        const errorMessage = JSON.stringify({ msg: 'Already exiting user', success: 'false' });
        res.status(409).json(errorMessage);
     }
     else {
     const newUser = await prisma.users.create({
        data:{
            ...userData, role: Number(userData.role)
        },
        select:{
            id: true,
            email:true, 
            location:true,
            role: true,
            phone:true,
        }
     })

     const token = jwt.sign({newUser}, process.env.JWT_SECRET!)
     
    const Message = JSON.stringify({ msg: 'Registered', success: 'true', token: token  });
    res.status(200).json(Message);
     
    }
    }
     }
     catch(err){
        const errorMessage = JSON.stringify({ msg: String(err), success: 'false' });
        res.status(409).json(errorMessage);
     }
}