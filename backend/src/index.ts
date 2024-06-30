import express from "express"
import cors from 'cors';
import cartRouter from './routes/cartRoutes.js'
import AuthRouter from "./routes/authRoutes.js";
import productRouter from "./routes/productAdminRoutes.js"
import productRouterUser from "./routes/productRoutes.js"
import imageRoute from "./routes/imageRoute.js"
import cloudinary from "cloudinary"
import { isSignedIn } from "./middlewares/auth.js";


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


app.use('/api/v1', AuthRouter);
app.use('/api/v1', productRouter)
app.use('/api/v1', productRouterUser)
app.use('/api/v1/', isSignedIn, cartRouter)
app.use('/api/v1/', imageRoute)



app.listen(port, ()=>{
    console.log(port)
})
