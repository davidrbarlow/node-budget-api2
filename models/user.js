const mongoose = require('mongoose');
const validator = require('validator');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    email:{
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      unique: true,
      validate:{
        validator: validator.isEmail,
        message:'{VALUE} is not a valid email'
      }
    },
    password:{
      type:String,
      require: true,
      minlength: 6
    },
    tokens: [{
      access:{
        type: String,
        required: true
  
      },
      token:{
        type:String,
        required: true
      }
    }]
  });

  UserSchema.virtual('transaction', {
    ref: 'Transaction',
    localField: '_id',
    foreignField: 'owner'
  });

  // removes everything but userid and and email, so only user id and email are sent back.
  UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();
  
    return _.pick(userObject, ['_id','email']);
  };


  UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();
  // replace concat with findIndex
  //https://stackoverflow.com/questions/35206125/javascript-es6-es5-find-in-array-and-change
  //const userTokens = user.tokens;
    let accessKeyCount = 0
    //user.tokens = user.tokens.concat([{access,token}]);
   let userTokens=[...user.tokens._parent.tokens];
   // let userTokens=[...user.tokens];
    //console.log('userTokens', user);
    userTokens.map((tokeninMap)=>{
      if(tokeninMap['access'] === access){
        tokeninMap['token'] = token;
        accessKeyCount++;
      }  
  });
  
  if (accessKeyCount === 0){
    //console.log('user.tokens[0] -> ',user.tokens[0])
    user.tokens._parent.tokens = [...userTokens, {access, token}];
    //user.tokens[0]= [...userTokens, {access, token}];
   //user.tokens = user.tokens.concat([{access,token}]);
  }
  return user.save().then(()=>{
      return token;
    });
  };

  UserSchema.methods.removeToken = function (token) {
    var user = this;
  
    return user.updateOne({
      $pull:{
        tokens:{token}
      }
    });
  
  };


  UserSchema.statics.findByToken = function(token) {
    var User = this;
    var decoded;
 
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      
    } catch (e){
      return Promise.reject();
    }
  
    return User.findOne({
      '_id': decoded._id,
      'tokens.token': token,
      'tokens.access': 'auth'
    });
};

  UserSchema.pre('save', function(next){
    var user = this;
    var hashedPassword;
  
    if (user.isModified('password')){
      bcrypt.genSalt(10, (err,salt) => {
       bcrypt.hash(user.password, salt, (err,hash)=>{
           
         user.password = hash;
         next();
        });
      });
  
    } else {
      next();
    }
  });

  UserSchema.statics.findByCredentials = function (email, password){
    var User = this;
    return User.findOne({email}).then((user) => {
      if(!user){
        return Promise.reject
      }
        return new Promise((resolve, reject) =>{
        bcrypt.compare(password, user.password, (err,res) =>{
          if (res === true) {
            resolve(user);
          } else {
            reject();};
        });
      });
    });
};

var User = mongoose.model('User', UserSchema);

module.exports={User};
