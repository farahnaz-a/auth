const express = require('express'); 

// Custom File import 
const AdminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const _ = express.Router();

// Admin Routes 
_.get('/add-product', isAuth, AdminController.getAddProduct);
_.post('/add-product', isAuth, AdminController.saveProduct); 
_.get('/edit-product/:productId', isAuth, AdminController.editProduct); 
_.post('/update-product', isAuth, AdminController.updateProduct);
_.post('/delete-product', isAuth, AdminController.removeProduct); 
_.get('/products', isAuth, AdminController.adminProducts); 

module.exports = _;