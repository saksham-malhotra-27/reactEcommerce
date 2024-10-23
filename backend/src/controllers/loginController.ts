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



export const loginController = async (req: Request, res: Response) => {
   try{
        
       const result = UserRequest.safeParse(req.body)
       if(!result.success){
        res.status(403).json({ msg: 'Invalid arguments', success: 'false' });
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
        res.status(200).json({ msg: 'Logged', success: 'true', user: user, token: token });
    }else{
        res.status(401).json({ msg: 'Invalid User', success: 'false' });
    }

    }
    }
    catch(err){
        res.status(409).json({ msg: String(err), success: 'false' });
    }

}

export const registerController = async (req: Request, res: Response)=> {
    try{

        const result= UserRequestReg.safeParse(req.body);
        if(!result.success){
            res.status(403).json({ msg: 'Invalid arguments', success: 'false' });
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
                res.status(409).json({ msg: 'Already exiting user', success: 'false' });
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
     
    res.status(200).json({ msg: 'Registered', success: 'true', user: newUser, token: token  });
     
    }
    }
     }
     catch(err){
        console.log(err)
        res.status(401).json({ msg: String(err), success: 'false' });
     }
}

/**

1. Login Controller

-- Check if a user with the given email and password exists 
SELECT id, email, location, role, phone 
FROM users 
WHERE email = '<userData.email>' AND password = '<userData.password>';


2. Register Controller

-- Check if the user already exists by email 
SELECT id, email, location, role, phone 
FROM users 
WHERE email = '<userData.email>';

-- If the user does not exist, insert a new user into the table 
INSERT INTO users (email, password, phone, role, location) 
VALUES ('<userData.email>', '<userData.password>', '<userData.phone>', '<userData.role>', '<userData.location>');

-- Select the newly created user 
SELECT id, email, location, role, phone 
FROM users 
WHERE email = '<userData.email>';

*/
