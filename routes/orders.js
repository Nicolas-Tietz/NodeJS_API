
const express = require('express');
const router = express.Router();
const {
  
  addOrder,
  deleteOrder,
  updateOrder,
  filter
} = require('../middlewares/orders')

router.use(express.json())




//Filter order by date and/or products
router.get('/',filter)

//Add new order to db
router.post('/',addOrder)
  
 

  
//Update existing order
  router.patch("/:id", updateOrder)

//Delete existing order
  router.delete("/:id",deleteOrder)


  module.exports = router;

  
