const Product = require("../models/product")


exports.adminProducts = (req, res, next) => {
    Product.find().populate('userId', 'name').then(products => {
        res.render('admin/products', {
            pageTitle : 'Admin Products', 
            path : '/admin/products', 
            prods : products
        })
    }).catch(err => console.log(err));
}

exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product', {
        pageTitle: 'Add a product', 
        path : '/admin/add-product'
    });
}

exports.saveProduct = (req, res, next) => {
    const title = req.body.title;
    const price = req.body.price;
    const imageUrl = req.body.imageUrl; 
    const description = req.body.description; 
    
    const product = new Product({
        title : title, 
        price : price,
        imageUrl : imageUrl, 
        description : description, 
        userId : req.user
    }); 

    product.save().then(() => {
        res.redirect('/admin/products');
    }).catch(err => console.log(err));

}

exports.editProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.findById(productId).then(product => {
        res.render('admin/edit-product', {
            pageTitle : 'Edit ' + product.title,
            path : '/admin/products', 
            product : product, 
            editing : true,
        });
    }).catch(err => console.log(err))
}

exports.updateProduct = (req, res, next) => {
    const productId = req.body.productId; 
    const title = req.body.title;
    const price = req.body.price;
    const imageUrl = req.body.imageUrl; 
    const description = req.body.description; 
    Product.findById(productId).then(product => {
        product.title = title; 
        product.price = price; 
        product.imageUrl = imageUrl; 
        product.description = description; 

        return product.save();

    }).then(() => {
        res.redirect('/admin/products');
    }).catch(err => console.log(err));
}

exports.removeProduct = (req, res, next) => {
    const productId = req.body.productId; 
    Product.findByIdAndDelete(productId).then(() => {
        res.redirect('/admin/products');
    }).catch(err => console.log(err));
}