

const User = require('../models/User')


// Create a MongoClient with a MongoClientOptions object to set the Stable API version







async function deleteUser(req,res){
    try{
       
       const uid = await User.findOne({ _id : req.params.id })
       if (!uid) return res.send('User Doesnt Exist')
       const result = await User.deleteOne({ _id: req.params.id }).exec()
       if (result.acknowledged == true){
        res.send('User Deleted Successfully')
       }else{
        res.send('Something went wrong')
       }
       
    }catch(err){
      return res.status(500).send(`message: ${err.message}`)
    }
    
}

async function listUsers(req,res) {
    

    
      // Connect the client to the server (optional starting in v4.7)
      
      const allUsers = await User.find().exec();

      res.send(allUsers)
   
  }

  
async function createUser(req,res){
    try{
      const {firstName,lastName,email} = req.body

      if (!(firstName && lastName && email)) return res.send('Missing some user datas. User needs : firstName, lastName and email')
      
     

      const result = await User.create({
        "firstName": firstName,
        "lastName": lastName,
        "email": email
      })

      console.log(result)

        
      return res.send(
        `New user has been created: <br/>
         First Name: ${firstName} <br/> 
         Last Name: ${lastName} <br/>
         Email: ${email}`
        );
    } catch(err){
      if (err.code == 11000){
        return res.status(409).send(`User with the email ${err.keyValue.email} already exists`)
      }

      return res.status(409).send(`message: ${err.message}`)
    }
  }

  
async function updateUser(req,res){
    try{
      
      const userInfos = ['firstName','lastName','email']

      if (Object.keys(req.body).length == 0) return res.send('Operation cancelled. Body is empty.')
      console.log(req.body)
      
      for (const elem in req.body){
        if (!userInfos.includes(elem)){
          return res.status(400).send(
            `There is no field called ${elem}.<br/>
             Fields are: firstName, lastName and email`)
        }
      }
      
      const fieldsToUpdate = {};
      if (req.body.firstName) fieldsToUpdate.firstName = req.body.firstName
      if (req.body.lastName) fieldsToUpdate.lastName = req.body.lastName
      if (req.body.email) fieldsToUpdate.email = req.body.email
      //Fills fieldsToUpdate with only the fields and values to update.
      
      
      
      const result = await User.updateOne({ _id: req.params.id },{ $set: fieldsToUpdate}).exec()
      console.log(
        `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
      );
      
      res.send('User Updated')

    } catch(err){
        return res.status(500).send(`message: ${err.message}`)
    }
  }

  module.exports = {
    updateUser,
    createUser,
    deleteUser,
    listUsers

  }


