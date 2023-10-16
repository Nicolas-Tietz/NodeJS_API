const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    products:[
        {type:mongoose.Schema.Types.ObjectId, ref:'Product'}
    ]
         
    ,
    users:[
        {type:mongoose.Schema.Types.ObjectId, ref:'User'}
    ],
    date: new Date()
})


module.exports = mongoose.model('Order',orderSchema)


