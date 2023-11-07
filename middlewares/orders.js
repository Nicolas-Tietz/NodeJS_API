
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const mongoose = require('mongoose');
const validator = require('email-validator')


//Create a new order
async function addOrder(req,res){
    try{

        const {products,users} = req.body
                
        if (!products && !(products == [])) return res.status(400).send('Orders must have at least one product')
        if (!users && !(users == [])) return res.status(400).send('Orders must have at least one user')

        //Checks for all products if they exist and if fields are valid
        for (const product of products){
            const productKeysLength = Object.keys(product).length
            if (productKeysLength != 1) return res.status(400).send('Product needs only one field: productName')
            
            if (Object.keys(product)[0] != 'productName' ) return res.status(400).send('Product must have only the following field: productName')
            
            const result = await Product.findOne({productName: product.productName}).exec()

            if (!result)  return res.status(400).send(`Query failed. The ${product.productName} product doesnt exist.`)


        }
       
        //Checks for all users if they exist and if fields are valid
        for (const user of users){

            const userKeysLength = Object.keys(user).length

            if (userKeysLength != 1) return res.status(400).send('User needs one field: email')

            if (Object.keys(user)[0] != 'email' ) return res.status(400).send('User must have only the following field: email')

            const result = await User.findOne({email: user.email})            

            if (!result) return res.status(400).send(`Query failed. The ${user.email} user doesnt exist.`)

    
        }

        //Create the order in the database
        const result = await Order.create({
            "products": products,
            "users": users
            
        }) 

        if (!result) return res.status(400).send('Order Creation Failed')
        
       

        res.status(200).json(result)
       

    }catch (err) {
        console.error(err.message)


    }

}

//Delete one Order from database
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

//Updates an order by adding/removing users/products
async function updateOrder(req,res){
    
    const productFields = ['productName','operation']
    const userFields = ['email','operation']
    try{

        const orderDoc = await Order.findOne({_id:req.params.id})
        if (!orderDoc) return res.status(400).send('Order not found.') 
   
        const {products: orderProducts,users: orderUsers} = orderDoc
        
        const {products,users} = req.body
        
        
        const addProducts = []
        const removeProducts= []
        const addUsers = []
        const removeUsers = []
        
        //updates will contain the push and pull updates for both users and products
        const updates = [];
        
        if (!users && !products){
            return res.status(400).send("To update an order you must add/remove at least one user/product")        
        } 
       
        if ((users && !users.length) || (products && !products.length)){
            return res.status(400).send('Order Update must contain at least one add/remove operation of an user/product')
        }
        
        const actualOrder = await Order.findOne({_id:req.params.id})

        if (users && users.length){
            for (const user of users){
                if (Object.keys(user).length != 2) return res.status(400).send('Fields must be 2: product and operation (add or remove)')
                for (const prop in user){
                    if (!userFields.includes(prop)) return res.status(400).send(`Field name ${prop} is invalid. Fields are: email and operation`)
                }

                if (user.operation =='add'){
                    if (orderUsers.some(u => u.email == user.email)) return res.status(400).send(`Operation failed. User ${user.email} already exists in this order.`) 
                }
                if (user.operation =='remove'){
                    if (!orderUsers.some(u => u.email == user.email)) return res.status(400).send(`Operation failed. User ${user.email} is not included in this order.`) 
                }

                const userExist = await User.findOne({email:user.email})
                if (!userExist) return res.status(400).send(`Operation failed. User ${user.email} doesnt exists`)
 
                const tempObj = {}
                tempObj['email'] = user.email
                if (user.operation == 'add'){
               
                    if (addUsers.some(u => u.email == user.email)) return res.status(400).send(`You cant add more than one unique user (${user.email})`)

                    addUsers.push(tempObj)
                }
                if (user.operation == 'remove'){
                    removeUsers.push(tempObj)
                }
                
            }
        }

        if (removeUsers.length == actualOrder.users.length && addUsers.length == 0){
            return res.status(400).send('Operation failed. You cant remove all users from an order as it must contain at least one user inside to exist.')
        }

        if (products && products.length){
            for (const product of products){
            
                if (Object.keys(product).length != 2) return res.status(400).send(`Operation failed. Fields must be : ${productFields}`)
                for (const prop in product){

                    if (!productFields.includes(prop)) return res.status(400).send(`Operation failed. Field name ${prop} is invalid. Fields are: product and operation`)   

                }
                
                const productExist = await Product.findOne({productName:product.productName})
                if (!productExist) return res.status(400).send(`Operation failed. Product ${product.productName} doesnt exists`)

                
            }
            
            const duplicateProducts = []

            
            for(const prod of products){
                //Checks if products to add already exist in the order
                if (prod.operation == 'add'){
                    if (actualOrder.products.some(p=>p.productName == prod.productName)){
                        duplicateProducts.push(prod.productName)
                    }else{
                        
                        if (addProducts.some(p => p.productName == prod.productName)) return res.status(400).send(`You cant add more than one unique product (${prod.productName})`)
                        addProducts.push({"productName":prod.productName})
                    }

                //Check if products to remove exist in the order to be able to remove them
                }else if (prod.operation =='remove'){
                    if (actualOrder.products.some(p=>p.productName == prod.productName)){
                        
                        if (removeProducts.some(p => p.productName == prod.productName)) return res.status(400).send(`You cant remove the same product from the order more than once. (${prod.productName})`)
                        removeProducts.push({"productName":prod.productName})
                    }else{
                       
                        return res.status(400).send(`The product ${prod.productName} doesnt exist in the order`)
                    }
                }

                
                
            }
            if (duplicateProducts.length){
                return res.status(400).send(`The following products already exist in the order: ${duplicateProducts}`)
            }

            
            if (removeProducts.length == actualOrder.products.length && addProducts.length == 0){
                return res.status(400).send('Operation failed. You cant remove all products from an order as it must contain at least one product inside to exist.')
            }

        }
        const pushArrays = {

        }

        //addProducts and addUsers will get added into the query if they are not empty.
        if (addProducts) pushArrays['products'] = addProducts
        if (addUsers) pushArrays['users'] = addUsers

        //Create the update query with products and users to push
        const updatePush = {
            updateOne: {
                filter: { _id: req.params.id },
                update: { $push: pushArrays }
            },
        }

        //Create the update query with products and users to pull
        const updatePull = {
            updateOne: {
                filter: { _id: req.params.id },
                update: { $pull: { products: { $in: removeProducts }, users: { $in: removeUsers } } }
            }
        }

        updates.push(updatePush)
        updates.push(updatePull)

        const updateResult = await Order.bulkWrite(updates)
        if (!updateResult) res.status(400).send('Something went wrong during the update.')


        const finalResult = await Order.findOne({_id:req.params.id}) ;
        

        
        
        
        return res.status(200).json(finalResult)




    }catch (err){
        console.error(err.message)
    }

}


function isValidDate(dateString) {
    return !isNaN(Date.parse(dateString));
}


//Return orders filtered by date/products
async function filter(req,res){
    try{
        const searchParams = new URLSearchParams(req.query)
        
        
    
        if (Object.keys(req.query).length == 0){
            const allOrders = await Order.find().exec();
            return res.send(allOrders) 
        }
        

        const filtersAvailable =['date','products']
        
        
        
        for (const [key,value] of searchParams){
            if (!filtersAvailable.includes(key)){
                return res.status(400).send(`The ${key} doesn't exists as a filter parameter. Actual parameters are: ${filtersAvailable}`)
            }
        }
        
        
        const date = new Date(req.query.date)
        if (!isValidDate(date)) return res.status(400).send('Date is not valid. Format should be yyyy-mm-dd')

        const productsString  = searchParams.get("products")

        const filter = {
            "date" : {$gte: date},
            
        }
        if (productsString != null){
            filter['products.productName'] = []
        }
        
       


        
        
        
        
        
        if (productsString != null){
            const products = productsString.split(',')
            //FIXARE QUI
            filter['products.productName'] = {$all: products}
            
            
            //Creare arrayFilter
            
            
            
        }
        
        
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
    filter
}



