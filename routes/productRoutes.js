const express = require('express');
const productController = require('../controllers/productController');
const router = express.Router();

//Post Method
router.post('/', (req, res) => {
  let response =  productController.addProducts(req.body)
  res.send(response)
})

//Get all Method
router.get('/', productController.getProduct)

//Get by ID Method
router.get('/:id', (req, res) => {
    res.send('Get by ID API')
})

//Update by ID Method
router.patch('/:id', (req, res) => {
    res.send('Update by ID API')
})

//Delete by ID Method
router.delete('/:id', (req, res) => {
    res.send('Delete by ID API')
})

module.exports = router;