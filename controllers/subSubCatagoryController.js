const subsubcatagory = require('../models/subSubCatagory')

exports.getSubSubCatagory = async (req, res, next) => {
    try {
        const recordExists = await subsubcatagory.find({deleted:false});
        if (recordExists) 
        res.status(200).send({data:recordExists});
      } catch (error) {
        res.status(400).json({ error: { message: error, code: error.code } });
      }
};

exports.addNewSubSubCatagory = async (req, res, next) => {
    try {
        const body = {
            name: req.body.name,
            subCatagory:req.body.subCatagory,
            description: req.body.description,
          };

      const newSubSubCatagoryAdded = await subsubcatagory.create(body);
      if (newSubSubCatagoryAdded)
        res.status(201).json({data:"data added successfully"});
    } catch (error) {
      res.status(500).json({ error: { message: error, code: error.code } });
    }
  };

  exports.getSubSubCatagoryById = async (req, res, next) => {
    try {
      const recordExists = await subsubcatagory.findById(req.params.id);
      if (!recordExists || recordExists.deleted) 
        res.status(400).json({ error: { message: "bad request | record not found" } });
      
      res.status(200).send({data:recordExists});
    } catch (error) {
      res.status(400).json({ error: { message: error, code: error.code } });
    }
  };


  exports.updateCatagory = async (req, res, next) => {
    try {
      const subSubCatagoryExist = await subsubcatagory.findById(req.params.id);
  
      if (!subSubCatagoryExist || subSubCatagoryExist.deleted)
        res.status(404).json({ error: { message: "item not found" } });
  
      const bodyForUpdate = {
        name: req.body.name,
        subCatagory:req.body.subCatagory,
        description: req.body.description,
        updatedAt: Date.now(),
      };
  
      const UpdatedCatagory = await subsubcatagory.findByIdAndUpdate(req.params.id,bodyForUpdate);
      if (UpdatedCatagory)
        res.status(201).json({ data:"item updated successfully" });
    } catch (error) {
      res.status(500).json({ error: { message: error, code: error.code } });
    }
  };

  exports.deleteCatagory = async (req, res, next) => {
    try {
      const recordExists = await subsubcatagory.findByIdAndUpdate(req.params.id);
      if (!recordExists || recordExists.deleted) 
        res.status(400).json({ error: { message: "bad request | record not found" } });
        
      const changeDeletedStatus = await subsubcatagory.findByIdAndUpdate(req.params.id,{deleted:true});
      if (changeDeletedStatus)
        res.status(201).json({ data:"item deleted successfully"});
    } catch (error) {
      res.status(500).json({error:{message: error, code: error.code }})
    }
  };
  