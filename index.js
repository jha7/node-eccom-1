var mysql=require("mysql");
var express=require("express");
const bodyParser=require('body-parser');
var ejs=require("ejs");
const { appendFile } = require("fs");
var session = require('express-session');
const { resolve } = require("path");


var app=express();
app.listen(4002);
app.use(session({secret: "Shh, its a secret!",resave:true,saveUninitialized:false,cookie:{secure:false,maxAge:1260000}}));

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
//app.use(express.urlencoded({ extended: true })) // for form data
app.set('view engine','ejs');

// define the mysql connection 
var host1='localhost';
var user1='ecomm_user_3';
var pass1='ecomm_pass_3';
var database1='node_ecomm3';
console.log("camme");
var db=mysql.createConnection({host:host1,user:user1,password:pass1,database:database1});


// connect now

db.connect(function(err){
    if(!err)
    {
        console.log("connected successfully1 ");
    }else{
        console.log("error in conenction");
    }
});


// Home page 
app.get(['/home',''],function(req,res){
    //req.session.ec_email='chandanjha.7@gmail.com';

    if(req.session.ec_email)
    {
    res.locals.user = req.session.ec_email;    
    }
//console.log("called to home with");
//console.log("session ka variable hai "+req.session.ec_email);

// fetch all the product details to shpw on the home page 

let p1=new Promise(function(resolve,reject){
    console.log("called to p1 promise ")


    var email = 'chandanjha.7@gmail.com';    

    var sql="SELECT * from user_fav where is_delete='0' and email='"+email+"'";
    console.log(sql);
    db.query(sql,function(err,rows){
    if(!err)
    {
        console.log("called to user_fav rows "+rows[0]['product_id'])

        //res.render('pages/index',{arr:rows});
        resolve(rows);
    }
    });

});
p1.then(function(data){

    console.log("called to then part ")
    console.log("called to next user_fav rows "+data[0]['product_id'])

var sql="SELECT * from product where is_delete='0'";
db.query(sql,function(err,rows){
if(!err)
{
    res.render('pages/index',{arr:rows,fav_arr:data});
}
});
}
)

});

// product page 
app.get(['/single*','/abc'],function(req,res){
    if(req.session.ec_email)
    {
    res.locals.user = req.session.ec_email;    
    }
console.log("camme to single wala "+req.url);
var this_url=req.url;
var id=this_url.split('?id=')[1];
console.log("id hai "+id);

// get all the product id details here
let p1=new Promise(
    function(resolve){
    var sql_product="SELECT * from product where id='"+id+"'";
    db.query(sql_product,(error,rows)=>{
        resolve(rows,id);
    });
    }
    );

    p1.then(function(data,id){
var cmd="SELECT * FROM gallery where id='"+data[0]['id']+"'";
db.query(cmd,function(error,rows,fields){
final_pic_arr(data,rows);
});

    });

function final_pic_arr(arr,pic_arr){
  // console.log("transferred successf uly with 1-2 as "+arr[0]['pic']+arr[1]['pic']);
   res.render("pages/single",{arr:arr,pic_arr:pic_arr});
}
//res.render("pages/single",{});
});


// signup page 
app.get('/signup-show',function(req,res){
    console.log("called to the login page");
    res.render("pages/signup",{});
});


// cart page 
app.get('/cart-show',function(req,res){
    console.log("CART ID === "+req.session.ec_cart);
if(req.session.ec_email)
    {
    res.locals.user = req.session.ec_email;    
    }

if(req.session.ec_email)
{
res.locals.user = req.session.ec_email;
}
// get all the cart related data in array format 
let p1=new Promise(function(resolve){
    
   if(!req.session.ec_cart)
   {    
const d = new Date();
let time = d.getTime();
    var new_cart_id=time;
    req.session.ec_cart=new_cart_id;
   }
   var cart_id=req.session.ec_cart;
var cmd="SELECT * from cart where cart_id='"+cart_id+"' and is_delete='0'";
db.query(cmd,function(err,rows){

// in case no data is fetched simply redirect it to the cart 
if(!rows.length)
{
    var arr=[];
   // req.session.ec_cart=cart_id;
    res.render('pages/cart',{arr:arr});
}
    resolve(rows);
});
});
// now fetch all the prpoduct details related to the cart 

p1.then(
    (data)=>{
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
farr=[];
for (let i = 0, p = Promise.resolve(); i < data.length; i++) {
    p = p.then(() => delay(i *200))
         .then(() => {
            var sql_product="SELECT * from product where id='"+data[i]['product_id']+"'";
            console.log(sql_product);
            db.query(sql_product,(error,rows)=>{
                console.log("product details came as "+rows.length+' and '+rows[0]['title']);
                farr[i]={};
                farr[i]['title']=rows[0]['title'];
                farr[i]['qty']=data[i]['qty'];
                farr[i]['product_id']=data[i]['product_id'];
                farr[i]['sp']=rows[0]['sp'];
                farr[i]['mrp']=rows[0]['mrp'];
                farr[i]['pic']=rows[0]['pic'];
                if(i==(data.length-1))
                {
                   // resolve(farr);
                   final_arr(farr);
                }
            });
        })
}
    })
function final_arr(arr){


    console.log("calleld to the cart final11111 arra ka fucntion with the size as "+arr.length);
    res.render('pages/cart',{arr:arr});

 //console.log("The final array ka lenmgth is "+arr.length);
// var json_data=JSON.stringify(arr);
// console.log(json_data);
//   return arr;
    //res.render('pages/cart1',{arr:arr});
}
// export part ends 
});
// add-to-cart logic
app.get('/add-cart*',function(req,res){
    if(req.session.ec_email)
    {
    res.locals.user = req.session.ec_email;    
    }
    const d = new Date();
    var created_on=d.getFullYear()+'/'+(+d.getMonth()+1)+'/'+d.getDate()+'  '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
    if(!req.session.ec_cart)
    {
console.log("session ka cart is is not set ");
 const d = new Date();
 let time = d.getTime();
     var new_cart_id=time;
     req.session.ec_cart=new_cart_id;
    }
    var cart_id=req.session.ec_cart;
    console.log('seeting session ka add to cart '+req.session.ec_cart);
    var qty=1;
var product_id=req.url.split("add-cart/")[1];
//console.log("add to cart logic for prouct id "+product_id);
var sql="INSERT INTO cart (product_id,cart_id,qty,created_on) values ('"+product_id+"','"+cart_id+"','"+qty+"','"+created_on+"')";
//console.log(sql);
db.query(sql,function(err,rows){
// now redirect it to the cart page to update the quantity if he wishes to 
res.redirect("/cart-show");
});
})



// logic for item delete from cart 

app.get('/delete-cart*',function(req,res){
    
   var cart_id=req.session.ec_cart;
var id=req.url.split("delete-cart/")[1];
console.log("delete cart is there ");
var sql="UPDATE cart set is_delete='1' where cart_id='"+cart_id+"' and product_id='"+id+"'";
console.log(sql);
db.query(sql,function(err,rows,fields){
if(!err)
{
console.log("deleted from cart ");
res.redirect('/cart-show');
}else
console.log("delete from cart failed");
})

});


//show to checkout page
app.get('/checkout-show',function(req,res){
    if(req.session.ec_email)
    {
    res.locals.user = req.session.ec_email;    
    }
    res.render('pages/checkout',{});

})

//order-form
app.post('/order-form',function(req,res){
   var email=(req.body.email);
   var mobile=(req.body.mobile);
   var fname=req.body.fname;
   var lname=req.body.lname;
   var full_name=fname+' '+lname;
   var address=req.body.address;
   var city=req.body.city; 
   var pin=req.body.pin;
   if(!req.session_ec_cart)
   {
const d = new Date();
let time = d.getTime();
    var new_cart_id=time;
    req.session.ec_cart=new_cart_id;
   }
   var cart_id=req.session.ec_cart;

   const d = new Date();
   var created_on=d.getFullYear()+'/'+(+d.getMonth()+1)+'/'+d.getDate()+'  '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
   var sql='INSERT INTO user_order (full_name,email,mobile,address,city,pin,cart_id,created_on) values ("'+full_name+'","'+email+'","'+mobile+'","'+address+'","'+city+'","'+pin+'","'+cart_id+'","'+created_on+'")';
   db.query(sql,function(err,rows){
    if(!err)
    {
        var sql="SELECT max(order_id) as last1 from user_order";
        db.query(sql,function(err,rows){
            var order_id=rows[0]['last1'];
            setTimeout(() => {
                var sql="SELECT * from user_order where order_id='"+order_id+"'";
        db.query(sql,function(err,rows){
            res.render('pages/order-placed',{order_arr:rows});
        });
                        }, 1200);
        });
    }
}); 
})


//signup form 
app.post(['/signup-form','/signup*'],function(req,res){
    var full_name=req.body.full_name;
    var email=req.body.email;
    var password=req.body.password;
    var mobile=req.body.mobile;
// first check whether this email id is registered or not
var sql="SELECT * FROM customer where email='"+email+"'";
db.query(sql,function(err,rows){
if(!err)
{console.log('pehle wala if loop');
    if(rows.length)
    {
    res.send('oops ! Email id is already registered. Try with some other email ID');
    }else{
    console.log('else')
    const d = new Date();
    var created_on=d.getFullYear()+'/'+(+d.getMonth()+1)+'/'+d.getDate()+'  '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
    var sql="INSERT INTO customer (full_name,email,password,created_on,mobile) values ('"+full_name+"','"+email+"','"+password+"','"+created_on+"','"+mobile+"')";
    db.query(sql,function(err,rows){

        if(!err)
        {    
            req.session.ec_email=email;
            res.send('success');
            //res.redirect('home');

        }
    });
    }
}

});

});


app.get('/login-show',function(req,res){

    console.log("called to the login wala page");
    console.log("and now here we are ");
    res.render('pages/login');


});



app.post('/login_submit',function(req,res){
    console.log("called to the login submit");

    const email=req.body.email;
    const password=req.body.password;

var sql="SELECT * FROM customer where email='"+email+"' and password='"+password+"'";
db.query(sql,function(err,rows){
if(!err)
{
    if(rows.length)
    {   
        // fetch the customer session variables 
        req.session.ec_email=rows[0]['email'];
        req.session.ec_name=rows[0]['full_name'];
        res.send('success');

    }else{
        res.send('Failure : Email ID / Password is incorrect. Try Again');
    }
}
});

});


// search product 
app.post('/search_product',function(req,res){
    var key1=req.body.key1;
    var sql="SELECT * FROM product where title like '%"+key1+"%'";
    db.query(sql,function(err,rows){
        if(!err)
        {   var one_li='';
        if(rows.length){
            for(var k=0;k<rows.length;k++){
            var one_li=one_li+"<li><a href='single?id="+rows[k]['id']+"'>"+rows[k]['title']+"</a></li>";
            }
        }else{
                var one_li=one_li+"<li>Oops No Result</li>";
 
            }
            setTimeout(function(){
                res.send(one_li);

            },1200);
        }else{
            console.log("erroor ocuucered while searching");
        }
    });
})



app.post("/add_fav",function(req,res){

console.log("add to fav is being called ")
console.log("user is "+req.session.ec_email);
var email=req.session.ec_email;
var product_id=req.body.id;
const d = new Date();
var created_on=d.getFullYear()+'/'+(+d.getMonth()+1)+'/'+d.getDate()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();

var sql="INSERT INTO user_fav (email,product_id,created_on) values ('"+email+"','"+product_id+"','"+created_on+"')";
console.log(sql);
db.query(sql,function(err,rows){
if(!err)
res.send('success');
else
res.send('failure');

});
})

