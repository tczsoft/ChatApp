'use strict';

var model = require("../models/allmodels");
var mailservices = require('../services/mail')

function generateOTP() {
        
    // Declare a digits variable 
    // which stores all digits
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 4; i++ ) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}

const setotp = async (req, res, next) => {
    
    try{
        var data = {...req.body,otp :generateOTP()}

        var find = await model['user'].findOne(req.body).lean();
        var checklogin = await model['checkuser'].findOne({'email' : req.body.Email}).lean();
       // console.log(find,checklogin)
        if(find == null){
            if(checklogin != null){
                var savedata = await model['user'](data).save();
                mailservices.mail(savedata.otp,req.body.Email)
                
                res.send({status : 'verify OTP'});
            }else{
                res.send({status : 'Unauthorized mail id'});
            }

        }
        else if(find.otp_status == 'not verified'){
            var updatedata = await model['user'].updateOne({'Email' : req.body.Email}, {'otp' :generateOTP()} )
            var updateotp = await model['user'].findOne(req.body).lean();
            console.log(updateotp.otp)
            mailservices.mail(updateotp.otp,req.body.Email)
            res.send({status : 'verify OTP'});
        }
        else{
            
            res.send({status : 'email id already exist'});
        }

    }
    catch(err){
        console.log(err)
        res.send(err)
    }

    
}

const verifyotp = async (req, res, next) => {
    try{
       
        var findata = await model['user'].findOne(req.body).lean();
        console.log(findata,{status : 'OTP verified', email : req.body.Email})
        var status = {status : 'OTP verified', email : req.body.Email}
        findata != null ? res.send(status): res.send({status : 'OTP invalid'});
    }
    catch(err){
        console.log(err);
        res.send(err);
    }
}

const register = async (req, res, next) => {
    try{
      var updatedata = await model['user'].updateOne({'Email': req.body.query},{...req.body.data,...{otp_status: 'verified',otp :''}});
      console.log(updatedata);
      updatedata.matchedCount == 1 ? res.send({status : 'register successfully'}) : res.send({status : 'register failed!! try again'});
     
    }
    catch(err){
        console.log(err);
        res.send(err);
    }
}

const resetotp = async (req, res, next) => {
    
    try{
        var updatedata = await model['user'].updateOne(req.body,{otp :''})
        console.log(updatedata)
        res.send({status : 'OTP Reset successfully'});
    }
    catch(err){
        console.log(err)
        res.send(err)
    }

    
}

module.exports  = {setotp,verifyotp, register, resetotp}