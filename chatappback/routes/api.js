var express = require('express');
var router = express.Router();
var authcontroller=require("../controllers/auth");
var chatcontroller=require("../controllers/chat");
var registercontroller = require('../controllers/register');
//-----authcontroller-------
router.get('/getusers', authcontroller.authenticateJWT,authcontroller.getusers);
router.post('/login', authcontroller.login);
//-----chatcontroller-------
router.post('/chatsave',authcontroller.authenticateJWT,chatcontroller.savechat);
router.delete('/deletechat',authcontroller.authenticateJWT,chatcontroller.deletechat);
router.get('/getchat',authcontroller.authenticateJWT,chatcontroller.getchats);
router.get('/getchatcount',authcontroller.authenticateJWT,chatcontroller.getchatscount);
router.get('/updatecount',authcontroller.authenticateJWT,chatcontroller.updateCount);
router.post('/sendrequest',authcontroller.authenticateJWT,chatcontroller.sendrequest);
router.get('/getrequest',authcontroller.authenticateJWT,chatcontroller.getrequest);
router.post('/actionrequest',authcontroller.authenticateJWT,chatcontroller.actionrequest);
router.post('/uploadfile',authcontroller.authenticateJWT,chatcontroller.uploadfile);
router.get('/getfullchat',authcontroller.authenticateJWT,chatcontroller.getfullchat);
router.post('/getotp', registercontroller.setotp);
router.post('/verifyotp', registercontroller.verifyotp);
router.put('/register', registercontroller.register);
router.put('/resetotp', registercontroller.resetotp);
module.exports = router;