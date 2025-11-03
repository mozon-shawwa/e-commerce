const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'name is required']
    },
    description:{
        type:String,
        required:[true,'description is required']
    },
    price:{
        type:Number,
        required:[true,'price is required'],
        min:0
    },
    category:{
        type:String,
        required: [true, 'category is required']
    },
    imageUrl:{
        type: String,
        required:false
    },
    stock:{
        type: Number,
        required: [true,'stock is required'],
        default:0
    },
    averageRating: {
        type: Number,
        default: 0
     },
    numOfReviews: {
        type: Number,
        default: 0
    }

}, 
{timestamps:true})

module.exports = mongoose.model('Product',productSchema);