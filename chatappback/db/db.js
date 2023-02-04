var mongoose = require('mongoose');
mongoose.Promise = Promise;
var con1=mongoose.createConnection('mongodb://localhost:27017/chatapp?retryWrites=true',
  {
    useNewUrlParser: true,

    useUnifiedTopology: true,
  },
  function (err, db) {
    console.log("chatapp Connected successfully");
  }
);
module.exports =exports=con1;