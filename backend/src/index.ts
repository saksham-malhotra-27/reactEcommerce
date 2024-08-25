import express from "express"
import cors from 'cors';
import cartRouter from './routes/cartRoutes.js'
import AuthRouter from "./routes/authRoutes.js";
import productRouter from "./routes/productAdminRoutes.js"
import productRouterUser from "./routes/productRoutes.js"
import  { generateImage } from "./routes/imageRoute.js"
import cloudinary from "cloudinary"
import { isSignedIn } from "./middlewares/auth.js";
import dotenv from 'dotenv'
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express()
const port = process.env.PORT ;



app.use(cors({
    origin: `${process.env.ORIGIN}`,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
}));


app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.get('/', (req, res)=>{
res.send('hello')
})
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.use('/api/v1', AuthRouter);
app.use('/api/v1', productRouter)
app.use('/api/v1', productRouterUser)
app.use('/api/v1/', isSignedIn, cartRouter)
app.post('/api/v1/generate', isSignedIn, generateImage);




app.listen(port, ()=>{
    console.log(port)
})
