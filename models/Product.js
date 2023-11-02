const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const productSchema = new Schema({
    productName:{
        type: String,
        required: true,
        unique: true
    }
})


module.exports = mongoose.model('Product',productSchema)