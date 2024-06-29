import { Router } from "express";
import { isSignedIn } from "../middlewares/auth.js";
import { getCategories, getCategory, getFeatured, getFilters, getproduct } from "../controllers/productController.js";

const route = Router()

route.get('/products/getfeat', getFeatured);
route.get('/products/getcat/:cat', getCategory)
route.get('/products/getallcat', getCategories )
route.get('/products/get/:id', getproduct)
route.get('/products/filters/', getFilters);
export default route 

