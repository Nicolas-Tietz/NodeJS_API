
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const mongoose = require('mongoose');


async function listOrders(req,res){
    
}

async function addOrder(req,res){
    try{
        const {products,users} = req.body
        
        console.log('Products',products)

        console.log(users)

        //Check if products or users array are empty
        if (!products && !(products == [])) return res.status(400).send('Orders must have at least one product')
        if (!users && !(users == [])) return res.status(400).send('Orders must have at least one user')

        
        
        
        for (const product of products){
            const productKeysLength = Object.keys(product).length
            if (productKeysLength != 1) return res.status(400).send('Product needs one field: product')
            
            if (Object.keys(product)[0] != 'name' ) return res.status(400).send('Product must have only the following field: product')
            
            console.log(product)
            const result = await Product.findOne({name: product.name}).exec()

            if (!result)  return res.status(400).send(`Query failed. The ${product.name} product doesnt exist.`)


        }
        //Checks if fields are correct to keep going
        for (const user of users){
            
            const userKeysLength = Object.keys(user).length
            if (userKeysLength != 1) return res.status(400).send('User needs one field: email')

            const result = await User.findOne({email: user.email})            
            if (!result) return res.status(400).send(`Query failed. The ${user.email} user doesnt exist.`)

            console.log('Utente: ',result)
        

           

        }

        
    
       

          const result = await Order.create({
            "products": products,
            "users": users
            
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

async function updateOrder(req,res){
    const operations = ['add','delete']
    const productFields = ['product','operation']
    const userFields = ['email','operation']
    try{
        const orderId = req.params.id
        const {products,users} = req.body

        const addProducts = []
        const deleteProducts= []
        const addUsers = []
        const deleteUsers = []

        for (const product of products){
            if (Object.keys(product).length != 2) return res.status(400).send('Fields must be 2: product and operation (add or delete)')
            for (const prop in product){
                if (!productFields.includes(prop)) return res.status(400).send(`Field name ${prop} is invalid. Fields are: product and operation`)
                
            }

            const productExist = await Product.findOne({name:product.name})
            if (!productExist) return res.status(400).send(`Product ${product.name} doesnt exists`)
        
            if (product.operation == 'add'){
                addProducts.push(product)
            }
            if (product.operation == 'delete'){
                deleteProducts.push(product)
            }


            
        }



        
        console.log(addProducts)

        //Check if the users and products exist before updating the order

        const result = await Order.findOneAndUpdate({_id:req.params.id},{$push: { "products": addProducts}},{new: true})
        if (!result) return res.status(400).send('Operation failed')
        
        
        return res.status(200).json(result)
        //Nel $set ci vanno gli addProducts
        //Nel $pull ci vanno i deleteProducts



    }catch (err){
        console.error(err.message)
    }

}

function isValidDate(dateString) {
    return !isNaN(Date.parse(dateString));
}

//Potrebbe aver senso fare un singolo filter, nel quale poi controllo se dentro c'è la data, i prodotti da filtrare o entrambi.
async function filter(req,res){
    try{
        const searchParams = new URLSearchParams(req.query)
        //If there is no filter, returns all orders.
        
    
        if (Object.keys(req.query).length == 0){
            const allOrders = await Order.find().exec();
            return res.send(allOrders) 
        }
        

        const filtersAvailable =['date','products']
        
        
        //Checks for wrong key parameters
        for (const [key,value] of searchParams){
            if (!filtersAvailable.includes(key)){
                return res.status(400).send(`The ${key} doesn't exists as a filter parameter. Actual parameters are: ${filtersAvailable}`)
            }
        }
        //PENSO DI DOVER AGGIUNGERE UN AGGREGATE PER MOSTRARLI IN ORDINE ASCENDING
        
        const date = new Date(req.query.date)
        if (!isValidDate(date)) return res.status(400).send('Date is not valid. Format should be yyyy-mm-dd')

        const productsString  = searchParams.get("products")

        const filter = {
            "date" : {$gte: date},
            
        }
        if (productsString != null){
            filter['products.product'] = []
        }
        
        // {products:{$in:[product1,product2]}}


        
        
        
        console.log(filter)
        
        
        console.log('rpdocutsstring',productsString)
        if (productsString != null){
            const products = productsString.split(',')
            console.log('prodotti',products)
            //FIXARE QUI
            filter['products.product'] = {$all: products}
            
            
            //Creare arrayFilter
            
            
            
        }
        
        console.log('Final filter',filter)
        
        const result = await Order.find(filter).sort({date:1})
        
        res.send(result);
    }catch (err){
        console.error(err)
    }

}




module.exports = {
    addOrder,
    updateOrder,
    deleteOrder,
    listOrders,
    filter
}



