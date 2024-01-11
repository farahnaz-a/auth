const express = require('express'); 

// Custom File import 
const ShopController = require('../controllers/shop'); 
const isAuth = require('../middleware/is-auth');

const _ = express.Router(); 

// Shop Routes 
_.get('/', ShopController.homePage);
_.get('/products', ShopController.productLists);
_.get('/products/:productId', ShopController.productDetail);
_.get('/cart', isAuth, ShopController.getCart);
_.post('/cart', isAuth, ShopController.addToCart);
_.post('/cart-delete', isAuth, ShopController.removeFromCart);
_.get('/orders', isAuth, ShopController.getOrders);
_.post('/create-order', isAuth, ShopController.createOrder); 

module.exports = _;