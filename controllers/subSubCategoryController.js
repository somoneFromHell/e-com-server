const subsubcategory = require('../models/subSubCategory')

exports.getSubSubCategory = async (req, res, next) => {
    try {
        const recordExists = await subsubcategory.find({deleted:false});
        if (recordExists) 
        res.status(200).send({data:recordExists});
      } catch (error) {
        res.status(400).json({ error: { message: error, code: error.code } });
      }
};

exports.addNewSubSubCategory = async (req, res, next) => {
    try {
        const body = {
            name: req.body.name,
            subCategory:req.body.subCategory,
            description: req.body.description,
          };

      const newSubSubCategoryAdded = await subsubcategory.create(body);
      if (newSubSubCategoryAdded)
        res.status(201).json({data:"data added successfully"});
    } catch (error) {
      res.status(500).json({ error: { message: error, code: error.code } });
    }
  };

  exports.getSubSubCategoryById = async (req, res, next) => {
    try {
      const recordExists = await subsubcategory.findById(req.params.id);
      if (!recordExists || recordExists.deleted) 
        res.status(400).json({ error: { message: "bad request | record not found" } });
      
      res.status(200).send({data:recordExists});
    } catch (error) {
      res.status(400).json({ error: { message: error, code: error.code } });
    }
  };


  exports.updateCategory = async (req, res, next) => {
    try {
      const subSubCategoryExist = await subsubcategory.findById(req.params.id);
  
      if (!subSubCategoryExist || subSubCategoryExist.deleted)
        res.status(404).json({ error: { message: "item not found" } });
  
      const bodyForUpdate = {
        name: req.body.name,
        subCategory:req.body.subCategory,
        description: req.body.description,
        updatedAt: Date.now(),
      };
  
      const UpdatedCategory = await subsubcategory.findByIdAndUpdate(req.params.id,bodyForUpdate);
      if (UpdatedCategory)
        res.status(201).json({ data:"item updated successfully" });
    } catch (error) {
      res.status(500).json({ error: { message: error, code: error.code } });
    }
  };

  exports.deleteCategory = async (req, res, next) => {
    try {
      const recordExists = await subsubcategory.findByIdAndUpdate(req.params.id);
      if (!recordExists || recordExists.deleted) 
        res.status(400).json({ error: { message: "bad request | record not found" } });
        
      const changeDeletedStatus = await subsubcategory.findByIdAndUpdate(req.params.id,{deleted:true});
      if (changeDeletedStatus)
        res.status(201).json({ data:"item deleted successfully"});
    } catch (error) {
      res.status(500).json({error:{message: error, code: error.code }})
    }
  };
  