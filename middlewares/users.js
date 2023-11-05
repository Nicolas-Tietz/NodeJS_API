

const User = require('../models/User')
const Order = require('../models/Order')
const validator = require('email-validator')
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
      
      if (!validator.validate(email)) return res.status(400).send(`The email ${email} is invalid. Insert a real one`)

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

      if (!validator.validate(req.body.email)) return res.status(400).send(`The email ${req.body.email} is invalid. Insert a real one`)

      if (Object.keys(req.body).length == 0) return res.status(400).send('Operation cancelled. Body is empty.')
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
      
      //Se viene updatata la mail dell'utente, ci ritroveremmo una mail sbagliata negli ordini creati precedentemente con l'user.
      //Quindi in questo caso BISOGNA controllare gli ordini in cui è presente la mail ed updatarla essendo essa univoca e visto che la
      //utilizzo per farci i fetch dei dati dell'utente.
      let preUpdateUser;
      if (req.body?.email){
        preUpdateUser = await User.findOne({_id: req.params.id})
        
      }
      
      const result = await User.updateOne({ _id: req.params.id },{ $set: fieldsToUpdate}).exec()
      console.log(
        `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
      );
      let ordersUpdatedString = ''
      //If the email gets updated, update also all orders that contain it
      if (result.modifiedCount == 1 && req.body?.email){
        if (req.body.email != preUpdateUser.email){
          //NON FUNZIONA FIXARE
          console.log('Pre',preUpdateUser.email)
          console.log('Post',req.body.email)
          const ordersUpdate = await Order.updateMany(
            { "users.email": preUpdateUser.email },
            { $set: { "users.$[].email": req.body.email } },
            { arrayFilters: [{ email: preUpdateUser.email }] }
          ).exec().then((result)=>{
            if (result.acknowledged == true){
              ordersUpdatedString = `User was included in ${result.matchedCount} order/s of which ${result.modifiedCount} have been updated`
            }
          }
          );



          
        }
      }
      
      
      res.status(200).send('User Updated. '+ ordersUpdatedString)

    } catch(err){
        console.log(err)
        if (err.code == 11000) return res.status(400).send('An User with this email already exists.')
        return res.status(500).send(`message: ${err.message}`)
    }
  }

  module.exports = {
    updateUser,
    createUser,
    deleteUser,
    listUsers

  }


