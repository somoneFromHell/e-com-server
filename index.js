const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config()
const app = express()

const products = require('./routes/productRoutes');
const category = require('./routes/categoryRoutes');
const subCategory = require('./routes/subCategoryRouts');
const subSubCategory = require('./routes/subSubCategoryRouts');



// -----------database connection--------------
const mongoString = 'mongodb+srv://rango:wUDPbtLUp7ZDQZQr@cluster0.2bxued0.mongodb.net/e-com-database?retryWrites=true&w=majority';
mongoose.connect(mongoString,{autoIndex:true})
.then(()=>console.log('connected to Database....')).catch(e=>console.log('oops..',e))


app.use(express.json());
app.use('/api/products/', products)
app.use('/api/category/',category)
app.use('/api/sub-category/',subCategory)
app.use('/api/sub-sub-category/',subSubCategory)

// app.all('*',(req,res,next)=>{
//     next(new AppError(`cant find on ${req.originalUrl} on this server`,400))
// });

// -----------starting server--------------
var port = process.env.PORT || 3200;
app.listen(port, () => {
    console.log(`Server Started at ${port}`)
})