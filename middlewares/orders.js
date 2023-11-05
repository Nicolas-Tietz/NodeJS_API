
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const mongoose = require('mongoose');
const validator = require('email-validator')

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
            if (productKeysLength != 2) return res.status(400).send('Product needs one field: productName')
            
            if (Object.keys(product)[0] != 'productName' ) return res.status(400).send('Product must have only the following field: productName')
            
            console.log(product)
            const result = await Product.findOne({productName: product.productName}).exec()

            if (!result)  return res.status(400).send(`Query failed. The ${product.productName} product doesnt exist.`)


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
    const operations = ['add','remove']
    const productFields = ['productName','operation']
    const userFields = ['email','operation']
    try{
        const orderDoc = await Order.findOne({_id:req.params.id})
        if (!orderDoc) return res.status(400).send('Order not found.') 
        
        //These contain the orders and products of the order that we are going to update
        const {products: orderProducts,users: orderUsers} = orderDoc
        

        //Fetcho l'order document
        //Controllo che non ci sia già presente l'utente che devo inserire
        //Inserisco l'utente se non è presente
        
        const {products,users} = req.body
        
        const addProducts = []
        const removeProducts= []
        const addUsers = []
        const removeUsers = []
        
        const updates = [];
        
        if (!users && !products){
            
            return res.status(400).send("To update an order you must add/remove at least one user/product")
            

            
        } 
        //If one of these contains at least one element it goes on, otherwise without anything to add/delete it stops here
        if ((users && !users.length) || (products && !products.length)){
            return res.status(400).send('Order Update must contain at least one add/remove operation of an user/product')
        }
        
        const actualOrder = await Order.findOne({_id:req.params.id})

        console.log('Prima')
        if (users && users.length){
            for (const user of users){
                
                //If the order already contains one of the users to add, the operation stops
                

                if (Object.keys(user).length != 2) return res.status(400).send('Fields must be 2: product and operation (add or remove)')
                

                for (const prop in user){
                    if (!userFields.includes(prop)) return res.status(400).send(`Field name ${prop} is invalid. Fields are: email and operation`)
                    //if (!productFields.includes(prop)) return res.status(400).send(`Field name ${prop} is invalid. Fields are: product and operation`)
                    
                }

                if (user.operation =='add'){
                    if (orderUsers.some(u => u.email == user.email)) return res.status(400).send(`Operation failed. User ${user.email} already exists in this order.`) 
                    

                }
                if (user.operation =='remove'){
                    if (!orderUsers.some(u => u.email == user.email)) return res.status(400).send(`Operation failed. User ${user.email} is not included in this order. `) 

                }

                

                const userExist = await User.findOne({email:user.email})
                
                if (!userExist) return res.status(400).send(`Operation failed. User ${user.email} doesnt exists`)

                
            
                const tempObj = {}
                tempObj['email'] = user.email
                if (user.operation == 'add'){
                    //If someone tries to update an order by adding 2 times the same user email, as an user cant be present mulitple times in the same order
                    if (addUsers.some(u => u.email == user.email)) return res.status(400).send(`You cant add more than one unique user (${user.email})`)

                    addUsers.push(tempObj)
                }
                if (user.operation == 'remove'){
                    removeUsers.push(tempObj)
                }
                console.log('pusho users')
            }
        }

        if (removeUsers.length == actualOrder.users.length && addUsers.length == 0){
            return res.status(400).send('Operation failed. You cant remove all users from an order as it must contain at least one user inside to exist.')
        }



        //If products array is not empty execute
        if (products && products.length){
            

            for (const product of products){
            
                if (Object.keys(product).length != 2) return res.status(400).send(`Operation failed. Fields must be : ${productFields}`)
                for (const prop in product){
                    if (!productFields.includes(prop)) return res.status(400).send(`Operation failed. Field name ${prop} is invalid. Fields are: product and operation`)
                    //if (!productFields.includes(prop)) return res.status(400).send(`Field name ${prop} is invalid. Fields are: product and operation`)
                    
                }
                
                const productExist = await Product.findOne({productName:product.productName})
                
                if (!productExist) return res.status(400).send(`Operation failed. Product ${product.productName} doesnt exists`)

                
            }
            
                //Contiene il documento completo.
            
            
            
            const duplicateProducts = []

            for(const prod of products){
                if (prod.operation == 'add'){
                    if (actualOrder.products.some(p=>p.productName == prod.productName)){
                        duplicateProducts.push(prod.productName)
                    }else{
                        //Prodotto non presente quindi lo pusho nell'array
                        if (addProducts.some(p => p.productName == prod.productName)) return res.status(400).send(`You cant add more than one unique product (${prod.productName})`)
                        addProducts.push({"productName":prod.productName})
                    }
                }else if (prod.operation =='remove'){
                    if (actualOrder.products.some(p=>p.productName == prod.productName)){
                        //Prodotto da rimuove è presente nell'ordine quindi procedo
                        if (removeProducts.some(p => p.productName == prod.productName)) return res.status(400).send(`You cant remove the same product from the order more than once. (${prod.productName})`)
                        removeProducts.push({"productName":prod.productName})
                    }else{
                        //Prodotto non presente quindi annullo
                        return res.status(400).send(`Il prodotto ${prod.productName} non è presente nell'ordine`)
                    }
                }

                
                
            }
            if (duplicateProducts.length){
                return res.status(400).send(`I seguenti prodotti sono già presenti nell'ordine: ${duplicateProducts}`)
            }
            console.log(addProducts)

            //Se superati tutti i test, quindi in removeProducts ci sono prodotti diversi tra loro ed esistono come prodotti e all'interno dell'ordine,
            //removeProducts.length dovrebbe contenere il numero di prodotti validi da rimuovere. Quindi se removeProducts.length == numeroProdotti dell'ordine E addProducts è vuoto
            //
            if (removeProducts.length == actualOrder.products.length && addProducts.length == 0){
                return res.status(400).send('Operation failed. You cant remove all products from an order as it must contain at least one product inside to exist.')
            }
            

            //A questo punto prodToPull e prodToPush contengono gli oggetti da rimuovere

        }
            const pushArrays = {
                
            }
            console.log('addproducts',addProducts)
            if (addProducts) pushArrays['products'] = addProducts
            if (addUsers) pushArrays['users'] = addUsers
            console.log('pusharra',pushArrays)
            const updatePush = {
                updateOne:{
                    filter:{_id: req.params.id},
                    update:{$push: pushArrays }},
                }

            const updatePull = {
                updateOne:{
                    filter:{_id: req.params.id},
                    update:{$pull:{products:{$in:removeProducts},users:{$in:removeUsers}}}
                }
            }
        
            updates.push(updatePush)
            updates.push(updatePull)
                
            const updateResult = await Order.bulkWrite(updates)
            if (!updateResult) res.status(400).send('Something went wrong during the update.')
            console.log(updateResult) 
            console.log('updates',updates)
        
                
        console.log('Si arriva')

        
                //Da qui posso fare i controlli sul documento completo invece di fare un findOne per prendere il pezzo specifico. In questo caso me lo prendo io il product specifico da modificare per aggiungere la query poi.
                /* if (found) {
                    console.log('Il prodotto da updatare contiene il prodotto da aggiungere/rimuovere-',found)
                    
                    
                }else{
                    if (product.quantity <= 0) return res.status(400).send(`Cant add ${product.name} as its quantity cant be 0 or lower.`)
                     const add = {
                        updateOne:{
                            filter:{_id: req.params.id},
                            update:{$push:{'name':product.name,'quantity':product.quantity}}

                        }
                    }  
                    } */



                //Will contain every time the update for the specific products
                
                //Push the update to the updates array
               // updates.push(update)

                
                

                
                /* if (found){
                    if (product.operation == 'add'){
                        queryTest['$inc'] = product.quantity

                    }else{
                        const check = await Order.findOne({_id:req.params.id,"products.name":{$in:[product.name]},"products.quantity":{$gte: product.quantity}})
                        
                        if (check){
                            const result = check.products.filter(prod=> prod.name == product.name)
                            //Se quantità da togliere == quantità prodotto
                            if (result[0].quantity == product.quantity){
                                //$pull prodotto dall'array
                            }else{
                                //altrimenti usa $inc per decrementarlo
                            }
                            
                        }else{
                            return res.status(400).send(`Operation Failed. Cant remove ${product.quantity} when its quantity in order is less than that.`)
                        }
                    }
                    //Aggiungere quantity
                }else{
                    //Altrimenti pusha direttamente prodotto + quantity
                } */

                /* const tempObj = {}
                tempObj['name'] = product.name
            
                if (product.operation == 'add'){
                    addProducts.push(tempObj)
                }
                if (product.operation == 'remove'){
                    removeProducts.push(tempObj)
                } */
            

            //Executes all the queries contained in updates

            
            
        

        const finalResult = await Order.findOne({_id:req.params.id}) ;
        
        //Check if the users and products exist before updating the order
        
        //FIXARE QUI
        /* if (addProducts.length || addUsers.length){
            finalResult = await Order.findOneAndUpdate({_id:req.params.id},{$addToSet: {products: {$each: addProducts} ,users: addUsers}},{new:true})
        } */

        

        /* if (removeProducts.length || removeUsers.length){
            finalResult = await Order.findOneAndUpdate({_id:req.params.id},{$pull: {products: removeProducts ,users: removeUsers}},{new:true})
        } */
        
        
        
        return res.status(200).json(finalResult)
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
            filter['products.productName'] = []
        }
        
        // {products:{$in:[product1,product2]}}


        
        
        
        console.log(filter)
        
        
        console.log('rpdocutsstring',productsString)
        if (productsString != null){
            const products = productsString.split(',')
            console.log('prodotti',products)
            //FIXARE QUI
            filter['products.productName'] = {$all: products}
            
            
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



