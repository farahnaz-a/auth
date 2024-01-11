const mongoose = require('mongoose'); 

const Schema = mongoose.Schema; 


const productSchema = Schema({
    title : {
        type : String, 
        require : true,
    }, 
    price : {
        type : Number, 
        require : true,
    },
    imageUrl : {
        type : String, 
        require : true,
    }, 
    description : {
        type : String, 
        require : false,
    }, 
    userId : {
        type : Schema.Types.ObjectId, 
        require : true,
        ref : 'User'
    }
}); 

const Product = mongoose.model('Product', productSchema); 

module.exports = Product;