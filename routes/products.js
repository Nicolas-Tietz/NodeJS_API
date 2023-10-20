
const express = require('express');
const router = express.Router();
const {
  
  addProduct,
  deleteProduct,
  updateProduct,
  listProducts
} = require('../middlewares/products')

router.use(express.json())


//Bisogna creare i controllers dei products


router.post('/',addProduct)
router.get('/',listProducts)
  
  //Aggiungere sorting?

  
  
  router.patch("/:id", updateProduct)


  router.delete("/:id",deleteProduct)


  module.exports = router;

  
