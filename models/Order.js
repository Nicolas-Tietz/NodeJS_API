const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    products:[
        {
            productName:{
                type: String,
                required: true,
                
            },
            _id: false
        }
    ]
         
    ,
    users:[
        {
            
            email:{
                type: String,
                required: true,
                
            },
            _id: false
        }
    ],
    date:{ type: Date , required: true, default: Date.now}
})


module.exports = mongoose.model('Order',orderSchema)


