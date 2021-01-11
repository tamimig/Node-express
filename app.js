const express = require('express');
const path = require('path');
//const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config({path: './.env'}); 
const routes = require('./routes/pages'); 
const auth1   = require('./routes/auth') ;
const db      = require('./db');
const cookieParser = require('cookie-parser');
const app = express();
 
const publicDirectory = path.join(__dirname, './public'); 
app.use(express.static(publicDirectory)); 
app.use(express.urlencoded({extended:false})); 
app.use(express.json()); 
app.use(cookieParser()); 
app.set('view engine', 'hbs');

db.connect((error)=> {
    if (error){
        console.log(error);
    }else{
        console.log("MySQL connected...");
    }
})
const port = process.env.PORT || 3000;

// use defined routes 

app.use('/', routes); 
app.use('/register', routes);
app.use('/auth', auth1); 

// app.get('/', (req, res) => {
//     //res.send("<h1>Hello from home page</h1>");
//     res.render('index'); 
// }); 

// app.get('/register', (req, res) => {
//     res.render('register'); 
// });


app.listen(port, () => console.log(`Server listening on ${port}`));