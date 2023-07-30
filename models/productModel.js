const { default: mongoose } = require("mongoose");
const mongo = require("mongoose");

const productModel = mongo.model('poducts',new mongo.Schema({
    image:{type:String,minlength:3},
    name:{type:String,required:true},
    description:{type:String,required:true},
    stock:{type:Number,required:true,default:0},
    color:{type:String},
    sku:{type:String},
    material:{type:String},
    price:{type:Number,required:true},
    quantity:{type:Number,default:1}
})); 

module.exports = productModel