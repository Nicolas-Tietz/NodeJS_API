
require('dotenv').config()


const mongoose = require('mongoose');

const connectDB = require('./config/dbConnection')

const express = require("express");

const app = express();

const port = 8000;


app.set('view engine','ejs'); 


connectDB()


const usersRouter = require('./routes/users');
const ordersRouter = require('./routes/orders');
const productsRouter = require('./routes/products');


app.use('/users',usersRouter)
app.use('/products',productsRouter)
app.use('/orders',ordersRouter)


mongoose.connection.once('open', ()=>{
  console.log('Connected to MongoDB');
  app.listen(port, () => console.log(`Server Running on port ${port}`));
})









