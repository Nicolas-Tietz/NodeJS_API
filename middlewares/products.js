const Product = require('../models/Product')
const Order = require('../models/Order')
async function listProducts(req,res){
    const allProducts = await Product.find().exec();
    res.send(allProducts)
}

async function addProduct(req,res){
    try{
        if (Object.keys(req.body).length != 1 || (Object.keys(req.body)[0] != 'productName') ) return res.status(400).send('Product requires one field: productName')
        const productName = req.body.productName
        
        
        
        const result = await Product.create({
            "productName": productName
            
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
            res.status(200).send(`Product ${product.productName} Deleted Successfully`)

        }else{
            res.status(400).send('Something went wrong during the product deletion')
        }
    }catch(err){
        console.error(err)
    }
}

async function updateProduct(req,res){
    try{
        const productName = req.body.productName
        let preUpdateProduct;
        let ordersUpdatedString = ''

        if (req.body.length == 0 || req.body.length >= 2 ) return res.send('Operation cancelled. Body has 1 field.')
        
        

        for (const elem in req.body){
            if (elem != 'productName'){
                return res.status(400).send(
                    `There is no field called ${elem}.<br/>
                    Fields are: product`
                )
            }
        }

        preUpdateProduct = await Product.findOne({_id: req.params.id})
        if (productName == preUpdateProduct.productName) return res.status(400).send('ProductName must be different from his actual one.')
        const result = await Product.findOneAndUpdate({_id: req.params.id},{$set: {productName:productName} }, {new: true})
        //Updates orders containing that product
        const ordersUpdate = await Order.updateMany(
            { "products.productName": preUpdateProduct.productName },
            { $set: { "products.$[].productName": req.body.productName } },
            { arrayFilters: [{ productName: preUpdateProduct.productName }] }
          ).exec().then((result)=>{
            console.log(result)
            if (result.acknowledged == true){
              ordersUpdatedString = `The Product was included in ${result.matchedCount} order/s of which ${result.modifiedCount} have been updated`
            }
          }
          );
          
        console.log(result)
        res.status(200).send('Product updated. '+ ordersUpdatedString)
            
        
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