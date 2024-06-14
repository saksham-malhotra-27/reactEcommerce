import express from "express"
import AuthRouter from "./routes/authRoutes.js";
import productRouter from "./routes/productAdminRoutes.js"
import cloudinary from "cloudinary"
cloudinary.v2.config({
    cloud_name: 'dxptcdxtr',
    api_key: '783749438291583',
    api_secret: 'r1zLyeAhSSKrjNU3aexuNRfBBu0',
})

const app = express()
const port = process.env.PORT || 3000;

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.get('/', (req, res)=>{
res.send('hello')
})


app.use('/api/v1', AuthRouter);
app.use('/api/v1', productRouter)

/*
app.get('/api/v1/testIsSignIn', isSignedIn, (req, res)=>{
    return  res.status(200).json(req.user);
})
app.post('/api/v1/testMulterTest', isSignedIn, singleUpload, multerTest)
*/

app.listen(port, ()=>{
    console.log(port)
})
