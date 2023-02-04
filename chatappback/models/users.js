var mongoose = require('mongoose');
var con = require('../db/db');
var moment = require('moment');
const con2 = require('../db/masterdb')
const Schema = mongoose.Schema;

let Usersschema=new Schema({
    Name:String,
    Email:String,
    Password:String,
    Requests:Array,
    Accepted:Array,
    otp : String,
    otp_status : {type : String, default : 'not verified'}
 }); 

 let chatschema=new Schema({
    Email:String,
    Message:String,
    from:String,
    to:String,
    Messagetype:{type:String,default:"text"},
    Tagedmessageid : String,
    view:{type:String,default:"0"},
    Date:{type:String,default:()=>moment().format("YYYY-MM-DD HH:mm:ss A")}
 }); 

 let masterdb = new Schema({

 },{strict:false})
 
 
var users = con.model("chatusers", Usersschema);
//users.watch().on("change", (data) => console.log(new Date(), data));
var chat = con.model("chatmasters", chatschema);
var checkuser = con2.model("empdts",masterdb)
module.exports ={users:users,chat:chat,checkuser: checkuser};