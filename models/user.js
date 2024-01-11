const mongoose = require('mongoose'); 

const Schema = mongoose.Schema; 

const userSchema = Schema({
    name : {
        type : String, 
        require : true 
    }, 
    email : {
        type : String, 
        require : true
    }, 
    password : {
        type : String, 
        require : true,
    }, 
    resetToken : String,
    resetTokenExpiration : Date,
    cart : {
        items : [
            {
                productId : {type : Schema.Types.ObjectId, require : true, ref : 'Product'}, 
                quantity : {type : Number, require : true}
            }
        ]
    }
});

userSchema.methods.addToCart = function(productId){
    let newQuantity = 1;
    if(this.cart.items.length === 0)
    {
        this.cart.items = [{productId : productId, quantity : newQuantity}];
    }
    else 
    {
        const cartProductIndex = this.cart.items.findIndex(cp => {
            return cp.productId.toString() === productId.toString();
        }); 
        if(cartProductIndex >= 0)
        {
            this.cart.items[cartProductIndex].quantity = this.cart.items[cartProductIndex].quantity + newQuantity;
        }
        else 
        {
            let oldCart = [...this.cart.items]; 
            oldCart.push({productId : productId, quantity : newQuantity});
            this.cart.items = oldCart;
        }
    }
    return this.save();
}

userSchema.methods.removeFromCart = function(productId) {
    const updatedCart = this.cart.items.filter(uc => {
        return uc.productId.toString() !== productId.toString();
    }); 
    this.cart.items = updatedCart; 
    return this.save();
}

userSchema.methods.clearCart = function(){
    this.cart.items = []; 
    return this.save();
}

const User = mongoose.model('User', userSchema); 

module.exports = User;