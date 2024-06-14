import { Response, Request } from "express";
import prisma from "../db/prisma.js";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "cloudinary"
import z from 'zod'

const UserRequestReg = z.object({
    name: z.string(),
    count: z.string(),
    category: z.string(),
})

const UserRequestUpdate = z.object({
    name: z.string(),
    count: z.string(),
})



export const createProduct = async (req: Request, res: Response)=>{
   try{
        const result =  UserRequestReg.safeParse(req.body)
        //console.log(req.body, result)
        if(!result.success){
            const errorMessage = JSON.stringify({ msg: 'Invalid arguments', success: 'false' });
            res.status(403).json(errorMessage);
        }
        else{
            let dataParsed = result.data;
            const data = {
                ...dataParsed, count: Number(dataParsed.count)
            }
            const file = req.file;
            if(file){
               const fileUri =  getDataUri(file);
               if(fileUri.content){
               const mycloud = await cloudinary.v2.uploader.upload(fileUri.content)
               const product = await prisma.products.create({
                data:{
                    name: data.name, 
                    modelPic : mycloud.secure_url,
                    modelId : mycloud.public_id,
                    count: data.count,
                    category: data.category,
    
                },
                select:{
                 name: true,
                 count:true,
                 category:true, 
                 modelPic: true,
                 modelId: true,
                }  
               })
               const Message = JSON.stringify({ msg: 'Product created', success: 'true', product: product });
               res.status(200).json(Message);


               }
               else{
                const errorMessage = JSON.stringify({ msg: 'Invalid file content', success: 'false' });
                res.status(409).json(errorMessage);
               } 
            }
            else{
                const errorMessage = JSON.stringify({ msg: 'Invalid file', success: 'false' });
                
                 res.status(409).json(errorMessage);
            } 
            
        }
    
    
   }
   catch(err){
       const errorMessage = JSON.stringify({ msg: String(err), success: 'false' });
       res.status(403).json(errorMessage);
   }
}

export const deleteProduct = async (req: Request, res: Response)=>{
    try{
         //const result =  UserRequestDelete.safeParse(req.body)
        //console.log(result, req.body)
        // console.log(result)
        const result =  req.params.slug 
        if(result == ""){
            const errorMessage = JSON.stringify({ msg: 'Invalid arguments', success: 'false' });
            res.status(403).json(errorMessage);
        }
        else{
            let dataParsed = result;
            const product = await prisma.products.delete({
                where:{
                    name: dataParsed
                },
                select:{
                    modelId: true,
                }
            })
            if(product){
                 await cloudinary.v2.uploader.destroy(product.modelId, ()=>{
                    console.log('Deleted')
                })
                const message = JSON.stringify({msg:"Deleted product", success: 'true'});
                res.status(200).json(message)
            }else{
                const errorMessage = JSON.stringify({ msg:'Invalid product', success: 'false' });
                res.status(403).json(errorMessage);
            }

        }
    }
    catch(err){
        const errorMessage = JSON.stringify({ msg: String(err), success: 'false' });
        res.status(403).json(errorMessage);
    }
}

export const updateProduct = async (req: Request, res: Response)=>{
    try{
        const result = UserRequestUpdate.safeParse(req.body);
        console.log(req.body)
        if(!result.success){
            const errorMessage = JSON.stringify({ msg: 'Invalid arguments', success: 'false' });
            res.status(403).json(errorMessage)
        }
        else{
            let data = result.data;
            const updatedProduct = await prisma.products.update({
                where:{
                    name: data.name,
                },
                data:{
                    count: Number(data.count)
                },
                select:{
                    name:true, 
                    count:true,
                    modelId:true,
                    modelPic:true,
                    category:true 
                }
            })
            if(updatedProduct){
                const message = JSON.stringify({msg:"Updated product", success: 'true', product: updatedProduct});
                res.status(200).json(message)
            }
            else{
                const errorMessage = JSON.stringify({ msg: "Cannot find the product", success: 'false' });
                res.status(403).json(errorMessage);
            }
        }
    }
    catch(err){
        const errorMessage = JSON.stringify({ msg: String(err), success: 'false' });
        res.status(403).json(errorMessage);
    }
}