
require('dotenv').config()
const mongoose = require('mongoose');

const connectDB = require('./config/dbConnection')

const express = require("express");

const app = express();

const port = 8000;




app.set('view engine','ejs'); 


connectDB()








async function addProduct(productName){
  try{
    await client.connect()
    await database.collection('products').insertOne({name:productName})
  } finally{
    await client.close()
  }
}

const usersRouter = require('./routes/users');
const ordersRouter = require('./routes/orders');
//const productsRouter = require('./routes/products');


app.use('/users',usersRouter)
//app.use('/products',productsRouter)

//Per aggiungere user, penso di fare una page con form per inserire i dati dell'utente da inserire
//Controllare anche SQL injection e pericoli vari



mongoose.connection.once('open', ()=>{
  console.log('Connected to MongoDB');
  app.listen(port, () => console.log(`Server Running on port ${port}`));
})




//Middlewares




