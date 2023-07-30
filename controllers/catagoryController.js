const catagory = require("../models/catagory");

exports.getCatagory = async (req, res, next) => {
    try {
        const recordExists = await catagory.find({deleted:false});
        if(recordExists.length === 0){
            res.status(204).end();
        }else{

            res.status(200).send({data:recordExists});
        }
      } catch (error) {
        console.error("Error while fetching categories:", error);
        res.status(500).json({ error: { message: "Server error" } });
          }
};

exports.addNewCatagory = async (req, res, next) => {
  try {
    const body = {
        name: req.body.name,
        description: req.body.description,
      };
      const catagoryIsUnique = await catagory.find({name:req.body.name,deleted:false}).count() === 0;
      if(catagoryIsUnique){
      const newCatagoryAdded = await catagory.create(body);
      res.status(201).json({data:newCatagoryAdded,message:"Category added successfully"});
      }else{

        return res.status(400).json({ error: { message: "Category with the same name already exists" }});
      }
    
  } catch (error) {

    console.error("Error while fetching categories:", error);
    res.status(500).json({ error: { message: "Server error" }});
  }
};


exports.getCatagoryById = async (req, res, next) => {
  try {
    const recordExists = await catagory.findById(req.params.id);
    if (!recordExists || recordExists.deleted) 
      res.status(400).json({ error: { message: "bad request | record not found" } });
    
    res.status(200).send({data:recordExists});
  } catch (error) {
    res.status(400).json({ error: { message: error, code: error.code } });
  }
};

exports.updateCatagory = async (req, res, next) => {
  try {
    const CatagoryExist = await catagory.findById(req.params.id);

    if (!CatagoryExist || CatagoryExist.deleted)
      res.status(404).json({ error: { message: "item not found" } });

    const bodyForUpdate = {
      name: req.body.name,
      description: req.body.description,
      updatedAt: Date.now(),
    };

    const UpdatedCatagory = await catagory.findByIdAndUpdate(req.params.id,bodyForUpdate);
    if (UpdatedCatagory)
      res.status(201).json({ data:"item updated successfully" });

  } catch (error) {
    res.status(500).json({ error: { message: error, code: error.code } });
  }
};

exports.deleteCatagory = (req, res, next) => {
  
   catagory.findByIdAndUpdate(req.params.id,{deleted:true,deletedAt:Date.now()},{new:true}).then(
   (updateCatagory) => {
       if(!updateCatagory){
        res.status(404).json({error:{message:"record not Found"}})
       }else{
        res.status(204).end();
       }
   }
   ).catch((error)=>{
    console.error("Error while deleting  catagory",error);
    res.status(500).json({error:{ message: "Server error" }})
   });
  
};

exports.getAllIncDelCatagory = async (req, res, next) => {
    try {
        const recordExists = await catagory.find();
        if(recordExists.length === 0){
            res.status(204).end();
        }else{
            res.status(200).send({data:recordExists});
        }
      } catch (error) {
        console.error("Error while fetching categories:", error);
        res.status(500).json({ error: { message: "Server error" } });
          }
};
