const Product = require('../models/Product')

async function listProducts(req,res){
    const allProducts = await Product.find().exec();
    res.send(allProducts)
}

async function addProduct(req,res){
    try{
        
        const productName = req.body.product
        
        if (Object.keys(req.body).length != 1 || (Object.keys(req.body)[0] != 'product') ) return res.status(400).send('Product requires one field: product')
        
        const result = await Product.create({
            "product": productName
            
        })
        if (result) res.json(result)

        
    } catch(err){

        if (err.code == 11000){
            return res.status(409).send(`Product with the name ${err.keyValue.product} already exists`)
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
            res.status(200).send(`Product ${product.product} Deleted Successfully`)

        }else{
            res.status(400).send('Something went wrong during the product deletion')
        }
    }catch(err){
        console.error(err)
    }
}

async function updateProduct(req,res){
    try{
        const productName = req.body.product
        
        if (req.body.length == 0 || req.body.length >= 2 ) return res.send('Operation cancelled. Body has 1 field.')
        
        for (const elem in req.body){
            if (elem != 'product'){
                return res.status(400).send(
                    `There is no field called ${elem}.<br/>
                    Fields are: name`
                )
            }
        }
        const result = await Product.findOneAndUpdate({_id: req.params.id},{$set: {product:productName} })
            
        
            
        res.status(200).json(result)
            
        
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