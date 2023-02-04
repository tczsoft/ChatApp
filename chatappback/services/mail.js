const nodemailer = require('nodemailer');

const mail = async (data,mailId)=>{
    
let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'vinayagam.mhb@gmail.com',
        pass: 'wmvxlcgjvresjpqb'
      }

  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: 'vinayagam.mhb@gmail.com', // sender address
    to: mailId, // list of receivers
    subject: "Chatapp OTP", // Subject line
    text: "Your OTP is : "+data, // plain text body
    html: "Your OTP is :<b>"+data+"</b> <br> OTP (One-time password) validity will expire after 2 minutes", // html body
  });

  console.log("Message sent: %s", info.messageId);
}

module.exports = {mail}