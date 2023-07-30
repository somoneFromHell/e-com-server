const subcatagory = require('../models/subCatagory')

exports.getSubCatagory = async(req,res,next)=>{
    let allSubCatagories = await  subcatagory.find() 

    if(allSubCatagories){
        res.status(201).send(allSubCatagories)
    }else{
        res.status(400).send("error fetching data")
    }
}

exports.addNewSubCatagory = async(req,res,next)=>{

    const newSubCatagory = await subcatagory.create(req.body)
    if(newSubCatagory){
        res.status(201).json({data:[{name:newSubCatagory.name,description:newSubCatagory.description,catagory:newSubCatagory.catagory}]})
    }else{

        res.status(400).json({error:"error",code:res.status.code})
    }
}
exports.getSubCatagoryById = async(req,res,next)=>{
    const oneCatagory = await subCategory.findById(req.params.id)
    if(!oneCatagory){
        res.status(400).json({err:"error"})
    }
    res.send(oneCatagory)
}

exports.updateSubCatagory = async(req,res,next)=>{
    const CatagoryExist = await subCategory.findByIdAndUpdate(req.params.id,req.body)
    if(CatagoryExist){
        res.send(CatagoryExist)
    }
    res.status(500).send(CatagoryExist)
}

exports.deleteSubCatagory = async(req,res,next)=>{
        const recordDeleted = await subCategory.findByIdAndUpdate(req.params.id)
        if(!recordDeleted){
            res.send("record not found")
        }
        res.send(recordDeleted)
}