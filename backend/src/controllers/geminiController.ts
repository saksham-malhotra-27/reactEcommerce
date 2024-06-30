import { Request, Response } from "express";

import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI('YOUR_GEMINI_API_KEY');

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
export const getImage = async (req: Request, res: Response) => {

    const prompt = "An abstract design with black and white boxes";
   // console.log('hi')

    try {
      const response = await model.generateContent(prompt); 
      const imageData = response; 
      res.status(200).json({ imageData }); 
    } catch (error) {
      console.error("Error generating image:", error);
      res.status(500).json({ error: "Failed to generate image" });  
    }
  };
  