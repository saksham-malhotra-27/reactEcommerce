import { Router } from "express";
import { isSignedIn, isAdmin } from "../middlewares/auth.js";
import singleUpload from "../middlewares/multer.js";
import { createProduct, deleteProduct, updateProduct } from "../controllers/productController.js";
const route = Router()

route.post('/products/createproduct', isSignedIn, isAdmin, singleUpload, createProduct);
route.delete('/products/deleteproduct/:slug', isSignedIn, isAdmin, deleteProduct);
route.post('/products/updateproduct', isSignedIn, isAdmin, updateProduct);

export default route;