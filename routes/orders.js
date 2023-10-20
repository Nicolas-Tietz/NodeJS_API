
const express = require('express');
const router = express.Router();
const {
  
  addOrder,
  deleteOrder,
  updateOrder,
  listOrders
} = require('../middlewares/orders')

router.use(express.json())


//Bisogna creare i controllers dei products


router.get('/',listOrders)
router.post('/',addOrder)
  
  //Aggiungere sorting?

  
  
  router.patch("/:id", updateOrder)


  router.delete("/:id",deleteOrder)


  module.exports = router;

  
