import { Response, Request } from "express";
import prisma from "../db/prisma.js";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "cloudinary";
import fs from 'fs';
import csvParser from 'csv-parser';

import z from 'zod';


interface ProductCSVRow {
    name: string;
    count: string;
    category: string;
    isFeatured: string;
    file1: string;
    file2: string;
    description: string;
    rating: string;
    price: string;
  }

const UserRequestReg = z.object({
    name: z.string(),
    count: z.string(),
    category: z.string(),
    isFeatured: z.string(),
    file1: z.string(),
    file2: z.string(),
    description: z.string(),
    rating: z.string(),
    price: z.string()
});






export const createProduct = async (req: Request, res: Response) => {
    try {
      const result = UserRequestReg.safeParse(req.body);
      console.log(req.body)
  
      if (!result.success) {
        return res.status(400).json({ msg: 'Invalid arguments', success: false });
      }
  
      const dataParsed = result.data;
      const data = {
        ...dataParsed,
        count: Number(dataParsed.count),
        isFeatured : (dataParsed.isFeatured==="true"? true: false),
        rating : Number(dataParsed.rating),
        price: Number(dataParsed.price)
      };
  
      const modelPics = [];
      modelPics.push(dataParsed.file1)
      modelPics.push(dataParsed.file2)
  
      const product = await prisma.products.create({
        data: {
          name: data.name,
          count: data.count,
          description: data.description,
          category: data.category,
          modelPic: modelPics,
          rating: data.rating,
          price: data.price,
          isFeatured: data.isFeatured || false, // Default to false if not provided
        },
      });
  
      res.status(201).json({ msg: 'Product created', success: true, product });
  
    } catch (err) {
      console.error('Error creating product:', err);
      res.status(500).json({ msg: 'Internal server error', success: false });
    }
  };

export  const createProductFromCSV = async (req: Request, res: Response) => {
    const products: ProductCSVRow[] = [];
    const csvFilePath = req.body.csvFilePath
 
   
    fs.createReadStream(csvFilePath)
      .pipe(csvParser())
      .on('data', (row) => {
        products.push(row);
      })
      .on('end', async () => {
        try {
          for (const row of products) {
            const data = {
              name: row.name,
              count: Number(row.count),
              category: row.category,
              description: row.description,
              rating: Number(row.rating),
              price: Number(row.price),
              isFeatured: row.isFeatured === 'TRUE' ? true : false,
            };
  
            const modelPics = [row.file1, row.file2];
  
            const product = await prisma.products.create({
              data: {
                description: data.description,
                rating: data.rating,
                name: data.name,
                count: data.count,
                category: data.category,
                modelPic: modelPics,
                isFeatured: data.isFeatured,
                price: data.price
              },
              select: {
                name: true,
                count: true,
                category: true,
                modelPic: true,
                isFeatured: true,
                description: true,
                rating: true,
                price: true,
              },
            });
  
            console.log(`Product created: ${product.name}`);
          }
  
          res.status(201).json({ msg: 'Products created successfully', success: true });
        } catch (err) {
          console.error('Error creating products:', err);
          res.status(500).json({ msg: 'Internal server error', success: false });
        }
      })
      .on('error', (err) => {
        console.error('Error reading CSV file:', err);
        res.status(500).json({ msg: 'Error reading CSV file', success: false });
      });
      
  };
  

export const getFeatured = async (req: Request, res: Response ) =>{
    try{
        const data = await prisma.products.findMany({
            where:{
                isFeatured: true
            }
        })
        res.status(200).json({success: "true", data})
    }
    catch(err){
        res.status(403).json({success:"false"})
    }
}

export const getCategory = async (req: Request, res: Response ) =>{
    try{
        const cat = req.params.cat
        const data = await prisma.products.findMany({
            where:{
                category: cat,
            }
        })
        res.status(200).json({success: "true", data})
    }
    catch(err){
        res.status(403).json({success:"false"})
    }
}


export const getCategories = async (req: Request, res: Response) => {
    try {
        const data = await prisma.products.findMany({
            select: {
                category: true
            }
        });

        // Extract unique categories using a Set
        const uniqueCategories = [...new Set(data.map(product => product.category))];

        res.status(200).json({ success: "true", data: uniqueCategories });
    } catch (err) {
        res.status(403).json({ success: "false" });
    }
}



export const getproduct = async (req: Request, res: Response ) =>{
    try{
        const id = req.params.id
        const data = await prisma.products.findMany({
            where:{
                id: id,
            }
        })
        if(data)
        res.status(200).json({success: "true", data})
        else
        res.status(404).json({success:false, msg:"invalid id"})
    }
    catch(err){
        res.status(403).json({success:"false"})
    }
}


export const getFilters = async (req: Request, res: Response) =>{
   try{
    const rating = req.query.rating ? parseInt(req.query.rating as string, 10) : undefined;
    const price = req.query.price ? parseInt(req.query.price as string, 10) : undefined;
    const category = req.query.category ? req.query.category as string : undefined;
    const isFeatured = req.query.isFeatured ? (req.query.isFeatured === 'true'? true: false ): undefined;

    let whereClause;
    if(isFeatured){
    whereClause = {
        rating: {gte: rating},
        price: { lte: price},
        category: category,
        isFeatured : isFeatured 
    }}
    else{
      whereClause = {
        rating: {gte: rating},
        price: { lte: price},
        category: category,
    }}
    

    const data = await prisma.products.findMany({
        where:whereClause
    });

    data.map((d)=>{
      console.log(d.isFeatured)
    })
    
    res.status(200).json({success:true, data:data})

   }
   catch(err){
       res.status(403).json({success:"false"})
   }
}





