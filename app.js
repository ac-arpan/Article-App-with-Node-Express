// console.log("Hello World");

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');

mongoose.connect('mongodb://localhost/nodekb');
let db = mongoose.connection;


// Check Connection
db.once('open',function(){
    console.log("Connected to mongoDB");
})
// Check for db errors
db.on('error',function(err){
    console.log(err);
})

// init app
const app = express();

// Bring in model
let Article = require('./models/articles');

//Body Parser Middleware parse application
app.use(bodyParser.urlencoded({extended : false}))
//parse appliation json
app.use(bodyParser.json())


// set public folder
app.use(express.static(path.join(__dirname,'public')));

// Express Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Load view engine
app.set('views',path.join(__dirname,'views'));
app.set('view engine','pug');


//home route
app.get('/',function(req,res){
    // res.send("Hello World!");
    // let articles = [
    //     {
    //         id:1,
    //         title:"Article-1",
    //         author:"Arpan",
    //         body:"This is Article 1"
    //     },
    //     {
    //         id:2,
    //         title:"Article-2",
    //         author:"Anindita",
    //         body:"This is Article 2"
    //     },
    //     {
    //         id:3,
    //         title:"Article-3",
    //         author:"Arpan",
    //         body:"This is Article 3"
    //     },
    // ]
    Article.find({},function(err,articles){
        if(err){
            console.log(err);
        }
        else{
            res.render('index',{
                'title' : 'Articles',
                'articles' : articles
            });
        }
        
    });
    
});

// Add Route
app.get('/articles/add',function(req,res){
    res.render('add_article',{
        title: "Add Article",
        
    })
})

// Add submit post route
app.post('/articles/add',function(req,res){
    let article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    article.save(function(err){
        if(err){
            console.log(err);
            return;
        }
        else{
            req.flash('success',"Article Added");
            res.redirect('/');

        }
    })

})

// get single articles(:id is just a placeholder,anything can be used like :aa and then req.params.aa)
app.get('/articles/:id',function(req,res){
    Article.findById(req.params.id,function(err,article){
        // console.log(article);
        res.render('article',{
            article:article
            
        })
    })

})

// Edit Article
app.get('/article/edit/:id',function(req,res){
    Article.findById(req.params.id,function(err,article){
        // console.log(article.body);
        res.render('edit_article',{
            title:"Edit Article",
            article:article
            
        })
    })

})

// Update submit post route
app.post('/article/edited/:id',function(req,res){
    // console.log('I am inside the post  request');
    
    let article = {};
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    let query = {_id:req.params.id};

    Article.update(query,article,function(err){
        if(err){
            console.log(err);
            return;
        }
        else{
            req.flash('success',"Article Updated");
            res.redirect('/');
        }
    })

})

app.delete('/delete/:id',function(req, res){
    let query = {_id:req.params.id};
    Article.remove(query,function(err){
        if(err){
            console.log(err);
            
        }
        res.send('success');
    })
})

// Start server
app.listen(3000,function(){
    console.log("Server started on port 3000");
})