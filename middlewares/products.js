const Product = require('../models/Product')
const Order = require('../models/Order')
async function listProducts(req,res){
    const allProducts = await Product.find().exec();
    res.send(allProducts)
}

async function addProduct(req,res){
    try{
        if (Object.keys(req.body).length != 1 || (Object.keys(req.body)[0] != 'name') ) return res.status(400).send('Product requires one field: name')
        const productName = req.body.name
        
        
        
        const result = await Product.create({
            "name": productName
            
        })
        if (result) res.json(result)

        
    } catch(err){

        if (err.code == 11000){
            return console.error(err)
          }
    
          return res.status(409).send(`message: ${err.message}`)
      
    }
  }

async function deleteProduct(req,res){
    try{
        const product = await Product.findOne({_id : req.params.id})
        if (!product) return res.send('Product doesnt exists')
        const result = await Product.deleteOne({_id: req.params.id}).exec()
        if (result.acknowledged == true){
            res.status(200).send(`Product ${product.name} Deleted Successfully`)

        }else{
            res.status(400).send('Something went wrong during the product deletion')
        }
    }catch(err){
        console.error(err)
    }
}

async function updateProduct(req,res){
    try{
        const productName = req.body.name
        let preUpdateProduct;

        if (req.body.length == 0 || req.body.length >= 2 ) return res.send('Operation cancelled. Body has 1 field.')
        
        

        for (const elem in req.body){
            if (elem != 'name'){
                return res.status(400).send(
                    `There is no field called ${elem}.<br/>
                    Fields are: product`
                )
            }
        }

        preUpdateProduct = await Product.findOne({_id: req.params.id})

        const result = await Product.findOneAndUpdate({_id: req.params.id},{$set: {name:productName} }, {new: true})
            
        const ordersUpdate = await Order.updateMany(
            { "products.name": preUpdateProduct.name },
            { $set: { "products.$[].name": req.body.name } },
            { arrayFilters: [{ name: preUpdateProduct.name }] }
          ).exec().then((result)=>{
            if (result.acknowledged == true){
              ordersUpdatedString = `Product was included in ${result.matchedCount} order/s of which ${result.modifiedCount} have been updated`
            }
          }
          );
        console.log(result)
        res.status(200).send('Product updated : '+JSON.stringify(result)+'<br/>'+ordersUpdatedString)
            
        
    }catch (err){
        console.error(err.message)
    }

}

module.exports = {
    addProduct,
    deleteProduct,
    updateProduct,
    listProducts
}

//Quando listo gli ordini, conteng