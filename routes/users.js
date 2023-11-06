
const express = require('express');
const router = express.Router();
const {
  listUsers,
  createUser,
  deleteUser,
  updateUser
} = require('../middlewares/users')


router.use(express.json())


  

//Add new user to db
router.post('/',createUser)
  
//List all users
  router.get("/",listUsers)
  
  //Update existing user
  router.patch("/:id", updateUser)

//Delete existing user
  router.delete("/:id",deleteUser)


  module.exports = router;

  

  