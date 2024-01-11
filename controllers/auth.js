const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer'); 
const smtpTransport = require('nodemailer-smtp-transport');
const crypto = require('crypto');

// Custom File import
const User = require('../models/user');


const transporter = nodemailer.createTransport(smtpTransport({
    service : 'gmail', 
    host: 'smtp.gmail.com', 
    auth : {
        user : 'spu.rahman@gmail.com', 
        pass : 'bofb iyxy jffi jmgv',
    },
    tls : { rejectUnauthorized: false }
}));


exports.signupPage = (req, res, next) => {
    res.render('auth/signup', {
        pageTitle : 'Sign up', 
        path : '/signup', 
        email_exists : req.flash('email_exists'),
        confirm_password : req.flash('confirm_password') 

    }); 
}

exports.postSignup = (req, res, next) => {
    const name   = req.body.name; 
    const email  = req.body.email; 
    const password = req.body.password;
    const confirm_password = req.body.confirm_password;

    if(email === '')
    {
        return res.redirect('/signup');
    }

    User.findOne({email : email}).then(user => {
        if(user)
        {
            req.flash('email_exists', 'This email already exists !');
            return res.redirect('/signup');
        }
        if(password !== confirm_password || !password)
        {
            req.flash('confirm_password', 'Password confirmation does not match !!!' );
            return res.redirect('/signup'); 
        }
    
          return bcrypt.hash(password, 12).then(hashedPassword => {
               const user = new User({
                    name : name, 
                    email : email, 
                    password : hashedPassword
               }); 
    
               return user.save();
    
          }).then(() => {
             req.flash('registration_success', 'Registration Successful !!!');
             res.redirect('/login');
             transporter.sendMail({
                from : 'Shop', 
                to : email, 
                subject : 'Welcome to shop!', 
                html : '<h1> Thank you for registering ! </h1>'
             }).catch(err => console.log(err))
          }).catch(err =>console.log(err))
    }).catch(err => console.log(err));

}


exports.loginPage = (req, res, next) => {
   

    res.render('auth/login', {
        pageTitle : 'Login Page', 
        path : '/login', 
        registration_success : req.flash('registration_success')
    });
}

exports.postLogin = (req, res, next) => {

    const email = req.body.email; 
    const password = req.body.password; 

    User.findOne({email : email}).then(user => {
         if(!user)
         {
            return res.redirect('/login');
         }
         return bcrypt.compare(password, user.password).then(result => {
               if(!result)
               {
                  return res.redirect('/login');
               }

               req.session.isLoggedIn = true; 
               req.session.user = user; 
               req.session.save(err => {
                console.log(err); 
                res.redirect('/');
               })

         }).catch(err => console.log(err));
    }).catch(err => console.log(err));
}

exports.logout = (req, res, next) => {
     req.session.destroy(err => {
        console.log(err); 
        res.redirect('/');
     })
}

exports.resetPassword = (req, res, next) => {
    res.render('auth/reset', {
        pageTitle : 'Reset Password', 
        path : '/reset', 
    })
}

exports.processReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if(err)
        {
            return res.redirect('/reset');
        }
        const token = buffer.toString('hex'); 
        User.findOne({email : req.body.email}).then(user => {
            if(!user)
            {
                return res.redirect('/reset');
            }
            user.resetToken = token; 
            user.resetTokenExpiration = Date.now() + 3600000; 
            return user.save(); 
        }).then(result => {
            res.redirect('/reset');
            transporter.sendMail({
                from : 'shop@shop.com', 
                to : req.body.email, 
                subject : 'Reset Password Request', 
                html : `
                     <p> Your reset passord link below : </p 
                     <a href="http://localhost:3000/reset/${token}">Click here</a>
                    `
            }).catch(err => console.log(err))
        }).catch(err => console.log(err));
    });
}

exports.newPassword = (req, res, next) => {

    const token = req.params.token; 
    User.findOne({resetToken : token, resetTokenExpiration : {$gt : Date.now()}}).then(user => {
        
            res.render('auth/new-pass', {
                pageTitle : 'Reset your password', 
                path : '/login',
                token : token, 
                userId : user._id.toString()
            })

    }).catch(err => console.log(err));
}

exports.saveNewPassword = (req, res, next) => {
    User.findById(req.body.userId).then(user => {
        
        return bcrypt.hash(req.body.password, 12).then(hashedPassword => {
             user.password = hashedPassword; 
             return user.save();
        })
    }).then(result => {
        res.redirect('/login'); 
    }).catch(err => console.log(err));
}