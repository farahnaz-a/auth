const express = require('express'); 
const bodyParser = require('body-parser'); 
const path = require('path'); 
const session = require('express-session'); 
const MongoDBStore = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
const csrf = require('csurf');
const flash = require('connect-flash');

// Custom File import 
const rootDir = require('./utils/path');
const User = require('./models/user');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop.js');
const ErrorController = require('./controllers/error');


// App initializer 
const app = express(); 
const port = 3000;
const MONGO_URI = 'mongodb+srv://spurahman:E8sconIkCDbWsBKJ@cluster0.efmvptt.mongodb.net/shop?';
const store = new MongoDBStore({
    uri : MONGO_URI,
    collection : 'sessions'
});
const csrfProtection = csrf();


// View engine
app.set('view engine', 'ejs'); 
app.set('views', 'views'); 

// Middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(rootDir, 'public')));
app.use(session({
    secret : 'my secret', 
    resave: false, 
    saveUninitialized : false, 
    store : store
})); 
app.use(flash());
app.use(csrfProtection);
app.use((req, res, next) => {
    if(!req.session.user)
    {
        return next();
    }
    User.findById(req.session.user._id).then(user => {
        req.user = user; 
        next();
    }).catch(err => console.log(err));
}); 
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn; 
    res.locals.csrfToken = req.csrfToken();
    next();
})

// Routes 
app.use(authRoutes);
app.use('/admin/', adminRoutes);
app.use(shopRoutes);
app.use(ErrorController.abort404);



// Connect to database and run the server at port
mongoose.connect(MONGO_URI).then(result => {
    app.listen(port, () => {
        console.log('Server is running!')
    })
}).catch(err => console.log(err));