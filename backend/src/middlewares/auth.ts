import { NextFunction, Request, Response } from "express";
import prisma from "../db/prisma.js"
import {z} from "zod"
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config()



export const isSignedIn = async (req: Request, res: Response, next: NextFunction)=>{
    try{
        const authHeader = req.headers.authorization;
        if(authHeader){
            const token = authHeader;
            jwt.verify(token, process.env.JWT_SECRET! , async (err, decoded)=>{
                if(err || !decoded){
                    return res.status(403).send('Token not verified');
                }
                const userPayload = decoded as JwtPayload
                const id = userPayload.id || userPayload.newUser.id
                const userValid = await prisma.users.findUnique({
                    where:{
                        id: id
                    },
                    select:{
                        id:true,
                        email:true, 
                        location:true,
                        role:true,
                        phone:true,
                    }
                })
                if(userValid){
                    req.user = userValid;
                    next();
                }
                else{
                    return res.status(401).send('Invalid user')
                }
            }) 

        }
        else{
            return res.status(401).send('Token not existing');
        }
    }
    catch(err){
        return  res.status(404).send('Server error')
    }

}

export const isAdmin = async (req: Request, res:Response, next: NextFunction)=>{
    if(req.user){
        if(req.user.role == 1){
            next();
        }
        else{
            return res.status(409).send('Not an admin');
        }

    }else{
        return res.status(401).send('Token not existing');
    }
}