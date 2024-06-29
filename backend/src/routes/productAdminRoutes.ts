import { Router } from "express";
import { isSignedIn, isAdmin } from "../middlewares/auth.js";
import { createProduct, createProductFromCSV } from "../controllers/productController.js";
import multipleUpload from "../middlewares/multer.js";
const route = Router()

route.post('/products/createproduct', isSignedIn, isAdmin,  createProduct);
route.post('/products/createproductfromcsv', isSignedIn, isAdmin, createProductFromCSV)
//route.delete('/products/deleteproduct/:slug', isSignedIn, isAdmin, deleteProduct);
//route.post('/products/updateproduct', isSignedIn, isAdmin, updateProduct);

export default route;