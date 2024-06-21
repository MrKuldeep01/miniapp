const express = require("express");
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser')

// setting view engine
app.set("view engine", "ejs");
// parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")));

// routes 

app.get('/',(req,res)=>{
    res.send('profile page')
})
app.get('/register',(req,res)=>{
    res.send('register page')
})
app.get('/post/create',(req,res)=>{
    res.send('profile creatitio page')
})
app.get('/post/delete',(req,res)=>{
    res.send('profile delete page')
})
app.get('/login',(req,res)=>{
    res.send('profile page')
})
app.get('/',(req,res)=>{
    res.send('profile page')
})


app.listen(3000);