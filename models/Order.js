const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    products:[
        {
            product:{
                type: String,
                required: true,
                
            },
            _id: false
        }
    ]
         
    ,
    users:[
        {
            firstName:{
                type: String,
                required: true
            },
            lastName:{
                type: String,
                required: true
            },
            email:{
                type: String,
                required: true
            },
            _id: false
        }
    ],
    date:{ type: Date , required: true, default: Date.now}
})


module.exports = mongoose.model('Order',orderSchema)


