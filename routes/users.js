
const express = require('express');
const router = express.Router();
const {
  listUsers,
  createUser,
  deleteUser,
  updateUser
} = require('../middlewares/users')


router.use(express.json())


  


router.post('/',createUser)
  
  //Aggiungere sorting?
  router.get("/",listUsers)
  
  
  router.patch("/:id", updateUser)


  router.delete("/:id",deleteUser)


  module.exports = router;

  

  