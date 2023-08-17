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

app.use(cors())

// -----------database connection--------------
const mongoString = 'mongodb+srv://rango:wUDPbtLUp7ZDQZQr@cluster0.2bxued0.mongodb.net/e-com-database?retryWrites=true&w=majority';
mongoose.connect(mongoString,{autoIndex:true})
.then(()=>console.log('connected to Database....')).catch(e=>console.log('oops..',e))

app.use(express.json());
app.use('/api/products/', products)
app.use('/api/category/',category)
app.use('/api/sub-category/',subCategory)
app.use('/api/sub-sub-category/',subSubCategory)
app.use('/api/role/',role)
app.use('/api/auth/',auth)

app.all('*',(req,res,next)=>{
    return res.status(400).json({ error: { message: "path not found" } });
});

// -----------starting server--------------
var port = process.env.PORT || 3200;
app.listen(port, () => {
    console.log(`Server Started at ${port}`)
})