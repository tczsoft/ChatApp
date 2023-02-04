var jwt = require('jsonwebtoken');
var model = require('../models/allmodels');
var accessTokenSecret="chatshhhhh";
const authenticateJWT = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, accessTokenSecret, (err, user) => {
            if (err) {
                return res.send(403);
            }

            req.user = user;
            next();
        });
    } else {
        res.json("Autheticted to access!!!!");
    }
}
const login=async (req, res, next) => {
   
    try {

        var user=await model['user'].findOne(req.body).lean();
        var dd="var msg;user==null?msg='error':msg='success';var token = user==null?'':jwt.sign({ data: user },accessTokenSecret)";
        eval(dd)

    res.send({token:token,msg:msg})

    } catch (err) {
        res.send(500).send(err);
    }


};

const getusers=async (req, res, next) => {
    
  try{
    var users=await model['user'].find({});
    res.send(users)
    } catch (err) {
        res.send(500).send(err);
    }

};
module.exports={login,getusers,authenticateJWT}