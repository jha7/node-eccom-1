var express=require("express");
var session=require('express-session');


        saveUninitialized: true,
        rolling: true,
        resave: true,
        proxy: true,
var app=express();
app.listen(4003);
app.use(session({secret: "Shh, its a secret!",
saveUninitialized: true,
rolling: true,
resave: true,
proxy: true,cookie:{secure:false,maxAge:60000}}));

console.log("Session is being called");


app.get('/test',function(req,res){
console.log('ccalled to chrome');
res.send('session ka chorme page');
//req.session.ec_email='chandanjha.7@gmail.com';

    if(!req.session.ec_email)
    {
        console.log('session ka ec email is not set ');
        req.session.ec_email='chandanjha.7@gmail.com';
        //res.send('session ka chorme page with session email is not set and now set '+req.session.ec_email );
        return;
    }
    else
    {
        console.log('session ka email hai '+req.session.ec_email.toString());
        //res.send(req.session.ec_email.toString());
        return;

    }

});