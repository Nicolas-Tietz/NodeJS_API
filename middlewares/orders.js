
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const mongoose = require('mongoose');
async function listOrders(req,res){
    const allOrders = await Order.find().exec();
    res.send(allOrders)
}

async function addOrder(req,res){
    try{
        const {products,users} = req.body
        
        let productsArr = []
        let usersArr = []

        console.log(Object.keys(users).length)
        console.log(Object.keys(products).length)

        const usersLength = Object.keys(users).length
        const productsLength = Object.keys(products).length

        if (!usersLength) return res.status(400).send('Order must have at least one User.')
        if (!productsLength) return res.status(400).send('Order must have at least one Product.')

        for (const product of products){
            const productKeysLength = Object.keys(product).length
            if (productKeysLength != 1) return res.status(400).send('Product needs one field: product')
            
            if (Object.keys(product)[0] != 'product' ) return res.status(400).send('Product must have only the following field: product')
            
            console.log(product)
            const result = await Product.findOne({product: product.product}).exec()

            if (!result)  return res.status(400).send(`Query failed. The ${product.product} product doesnt exist.`)

            
            productsArr.push(product)
            
            
            
            
            
            

        }
        for (const user of users){
            
            const userKeysLength = Object.keys(user).length
            if (userKeysLength != 1) return res.status(400).send('User needs only one field: email')

            const result = await User.findOne({email: user.email})            
            if (!result) return res.status(400).send(`Query failed. The ${user.email} user doesnt exist.`)

            console.log('Utente: ',result)
        

            usersArr.push(result)

        }

        
    
       

          const result = await Order.create({
            "products": productsArr,
            "users": usersArr
            
        }) 

        if (!result) return res.status(400).send('Order Creation Failed')
        
       

        res.status(200).json(
            result
            
            )
        /* for (const user of users){
            console.log('utente:',user)
        } */

    }catch (err) {
        console.error(err.message)


    }

}
async function updateOrder(req,res){

    try{
        


    }catch (err){

    }

}
async function deleteOrder(req,res){
    try{
        const orderId = await Order.findOne({ _id : req.params.id})
        if (!orderId) return res.send('Order doesnt exist')
        const result = await Order.deleteOne({ _id : req.params.id}).exec()
        if (result.acknowledged == true){
            res.send('Order Deleted Successfully')
        }else{
            res.send('Something went wrong.')
        }
    }catch (err){
        console.error(err);
    }
}

async function filterByDate(req,res){

}
async function filterByProducts(req,res){

}


module.exports = {
    addOrder,
    updateOrder,
    deleteOrder,
    listOrders
}



/*
"_id":"652d67502ff17e5167a9e986",
			"firstName": "asdasdastest",
			"lastName": "test@gmail.com",
			"email": "tetst1@gmail.com"
            
            
            */