
const express = require('express');
const router = express.Router();
const {
  
  addProduct,
  deleteProduct,
  updateProduct,
  listProducts
} = require('../middlewares/products')

router.use(express.json())



//Add new product to db
router.post('/',addProduct)
//List all products
router.get('/',listProducts)
  

  
  //Update existing product
  router.patch("/:id", updateProduct)

//Delete existing product
  router.delete("/:id",deleteProduct)


  module.exports = router;

  
