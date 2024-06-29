import { Router } from "express";
import { isSignedIn, isAdmin } from "../middlewares/auth.js";
import { getImage } from "../controllers/geminiController.js";
const route = Router()

route.get('/generate', getImage);
//route.delete('/products/deleteproduct/:slug', isSignedIn, isAdmin, deleteProduct);
//route.post('/products/updateproduct', isSignedIn, isAdmin, updateProduct);

export default route;