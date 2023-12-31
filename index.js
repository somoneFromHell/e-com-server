const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config()
const app = express()
const cors = require('cors');
const products = require('./routes/productRoutes');
const category = require('./routes/categoryRoutes');
const subCategory = require('./routes/subCategoryRouts');
const subSubCategory = require('./routes/subSubCategoryRouts');
const role = require('./routes/roleRoutes');
const auth = require('./routes/authRouts');
const user = require('./routes/userRouts');
const globleErrorHandler = require('./controllers/errorController')

const appError = require('./utils/appError')

app.use(cors())

// -----------database connection--------------
const mongoString = 'mongodb+srv://rango:wUDPbtLUp7ZDQZQr@cluster0.2bxued0.mongodb.net/e-com-database?retryWrites=true&w=majority';
mongoose.connect(mongoString,{autoIndex:true})
.then(()=>console.log('connected to Database....')).catch(e=>console.log('oops..',e))



app.use(express.json());


app.use('/api/user-images',express.static('images'))
app.use('/api/products/', products)
app.use('/api/category/',category)
app.use('/api/sub-category/',subCategory)
app.use('/api/sub-sub-category/',subSubCategory)
app.use('/api/role/',role)
app.use('/api/auth/',auth)
app.use('/api/user/',user)

app.all('*',(req,res,next)=>{
    // return res.status(400).json({ error: { message: "path not found" } });
    // const err =  new Error("not found")
    // err.status = 'fail'
    // err.statusCode = 404 
    // next(err)

    next(new appError(`${req.originalUrl} not found!`,404))


});

app.use(globleErrorHandler)


// -----------starting server--------------
var port = process.env.PORT || 3200;
const server = app.listen(port, () => {
    console.log(`Server Started at ${port}`)
})

process.on('unhandledRejection',err=>{
    console.log(err.name,err.message)
    console.log("UNHANDELED REHJECTION! (0.0) shutting down...");
    server.close(()=>{
        process.exit(1);  
    })
})

