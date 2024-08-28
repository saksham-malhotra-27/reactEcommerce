import { Request, Response } from "express";
import z from 'zod'
import prisma from "../db/prisma.js";
const ReqBody = z.object({
    name:z.string(),
    picURL:z.string(),
    quantity: z.number(),
})

const ReqBody2 = z.object({
    quantity: z.number(),
    delete: z.boolean(),
    id: z.string()
})

export const save3d = async(req: Request, res: Response)=>{
try{
    const userId = req.user?.id;
    const threeDObj = ReqBody.safeParse(req.body);
    if(!threeDObj.success){
        return res.status(400).json({success:false, msg:"Unvalid body"})
    }
    const savethreedobj = await prisma.threedOne.create({
        data:{
            userId: userId!,
            name:   threeDObj.data.name,
            picURL: threeDObj.data.picURL,
            quantity: threeDObj.data.quantity
        }
    })
    console.log(savethreedobj)
    return res.status(200).json({success:true, msg:"Saved to cart"})
}
catch(err){
    return res.status(500).json({success:false, msg:"Server Error"})
}
}

export const get3ds = async (req: Request, res: Response) => {
    try{
        const userId = req.user?.id 
        const threeds = await prisma.threedOne.findMany({
            where:{
                userId:userId,
            }
        })
        return res.status(200).json({success:true, data:threeds})
    } catch (err) {
        return res.status(500).json({success:false, msg:"Server Error"})       
    }
}

export const update3ds = async (req: Request, res: Response) => {
    try{
        const threeDObj = ReqBody2.safeParse(req.body);
        if(!threeDObj.success){
            return res.status(400).json({success:false, msg:"Unvalid body"})
        } 
        if(threeDObj.data.delete){
            const threeD  = await prisma.threedOne.delete({
                where:{
                    userId: req.user?.id!,
                    id: threeDObj.data.id
                }
            })
            return res.status(200).json({success:true, msg:"deleted"})
        } else {
            const update3d = await prisma.threedOne.update({
                where:{
                    id: threeDObj.data.id,
                },
                data:{
                    quantity: threeDObj.data.quantity,
                }
            })
            return res.status(200).json({success:true, data: update3d})      
        }
    } catch (err) {
        return res.status(500).json({success:false, msg:"Server Error"})              
    }
}

