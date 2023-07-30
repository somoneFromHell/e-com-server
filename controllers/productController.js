const productModel = require('../models/productModel');
const { response } = require('express');

exports.getProduct = async(req,res,next)=>{
    res.status(201)
    .json({data:[{id:1,name:"mike"},{id:2,name:"rango"}]})
}

exports.addProducts = async (data)=>{
        var response = await productModel.create(data)
    if(response){
        return response
    }else{
        return error
    }
    
}

module.exports

