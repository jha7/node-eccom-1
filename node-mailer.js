var nodemailer = require('nodemailer');
console.log("page is called ");
var transporter = nodemailer.createTransport({
  service: 'smtpout.secureserver.net',
  auth: {
    user: 'support@thewebsite.live',
    pass: 'Supportliveweb123!@'
  }
});
console.log("transporter is defined");

var mailOptions = {
  from: 'support@thewebsite.live',
  to: 'chandanjha.7@gmail.com',
  subject: 'thewebsite.live Order ID ',
  text: 'please track your order id '
};


console.log("type of mailoptions is  ");
transporter.sendMail(mailOptions, function(error, info){
    console.log("inside send mail ");
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});