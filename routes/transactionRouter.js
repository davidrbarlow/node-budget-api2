const express = require('express');
const fileUpload = require('express-fileupload');
const csv = require('fast-csv');
const _ = require('lodash');
const mongoose = require('mongoose');
const {ObjectID} = require('mongodb');
const moment = require('moment');

const transactionRouter = express.Router();

const {Transaction} = require('../models/transaction');
const {authenticate} = require('../middleware/authenticate');


transactionRouter.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization,x-auth");
  res.header("Access-Control-Expose-Headers", "x-auth");
  //  res.header("Content-Type : text/plain");
  res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE,PATCH');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if ('OPTIONS' == req.method) {
      //res.send(200);
      res.header("Access-Control-Allow-Origin", "*").sendStatus(200);
  }
  else {
  next();
  }
});



transactionRouter.use(fileUpload());

transactionRouter.post('/upload',  authenticate, (req, res) =>{
  const headers = [,'postedAt','description','amount',,'balance',,,];
  console.log('req ',req.files.file);
  const transactionFile = req.files['file'];
  const transactions = [];
  
   try {
      csv
      .fromString(transactionFile.data.toString(), {
          headers: headers,
          ignoreEmpty: false
      })
      .on("data", function(data){
         // console.log("amount : ",data.amount);
          data.postedAt=moment(data.postedAt,'MM/DD/YYYY').unix()*1000;
          data.amount=Math.round(data.amount*100);
          //console.log("data.amount : ",data.amount);
          data.accountType='Bank';
          data.owner=req.user._id;
          transactions.push(data);
          //console.log(moment.unix(data.postedAt).format('MM/DD/YYYY'));
      }) 
      .on("end", function(){
        transactions.shift();
          let transactionResult = Transaction.create(transactions);
          transactionResult
          .then((document)=>{res.status(200).send('document uploaded')})
          .catch((e)=>{
            console.log('catch1 ',e);
            console.log('**************');
            res.status(400).send(e);
          });
        //   Transaction.create(transactions, (err, document) => {
        //    if (err){
        //    throw(err);
        //   } else{
        //     res.send('Transactions have been successfully uploaded.');
        //   }
        
        // });
      })
      .on("error", function(error){
        console.log('transactions', error);
        console.log('**************');
        res.status(400).send('error1 : '+error);
      });
    }
    catch(e){
      console.log('error');
      res.status(400).send('error2: '+e);
    }

  
  
});

transactionRouter.get('/', authenticate, (req,res) =>{
  //await req.user.populate('transactions').execPopulate()
  Transaction.find({owner: req.user._id}).then((transactions)=>{
   // console.log('transactions being sent',transactions);
    res.send({transactions})
  }).catch((e)=>{
    res.status(400).send(e);
  })

});

transactionRouter.post('/transaction', authenticate, (req,res)=>{
  //console.log('post transaction ', req.body);
  const transaction = new Transaction({
    postedAt: req.body.postedAt,
    description: req.body.description,
    amount: req.body.amount,
    cycle: req.body.cycle,
    accountType: req.body.accountType,
    owner: req.user._id
  });

  setAsBalance = transaction.cycle === 'Balance' ? true : false;
  transaction.setAsBalance = setAsBalance;

  transaction.save().then((doc)=>{
    res.send(doc);
  }).catch((e) => {
    res.status(400).send(e);
  });
});

transactionRouter.get('/transaction/:id', authenticate, (req,res)=>{
  var id = req.params.id;
  if (!ObjectID.isValid(id)){
    return res.status(404).send();
  }
  Transaction.findOne({
    _id: id, owner: req.user._id
  }).then((transaction)=>{
      if (!transaction){
        res.status(404).send();
      } else{res.send({transaction})}
    }).catch((e) => {
      res.status(400).send();
    })
});

transactionRouter.patch('/edit/:id', authenticate, (req,res) =>{
  let id = req.params.id;
  let body = _.pick(req.body, ['postedAt', 'description', 'amount', 'accountType', 'cycle']);
  body.setAsBalance = body.cycle === 'Balance' ? true : false;

  if (!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Transaction.findOneAndUpdate({
    _id:id,
    owner: req.user._id
  }, {$set: body}, {new: true}).then((transaction) => {
    if (!transaction){

      return res.status(404).send();
    }
    res.send({transaction});
  }).catch((e)=>{
    res.status(400).send()
  });

});

transactionRouter.delete('/remove/:id', authenticate, (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  Transaction.findOneAndDelete({
    _id : id,
    owner: req.user._id
  }).then((transaction)=>{
    res.send({transaction});
  }).catch((e)=>{
    res.status(400).send();
  })

});

//Site.deleteMany({ userUID: uid, id: { $in: [10, 2, 3, 5]}}, function(err) {})

transactionRouter.patch('/removeSelected',  authenticate, (req,res) =>{
  const body = _.pick(req.body, ['ids']);
  for (let i in body.ids){
    if (!ObjectID.isValid(body.ids[i])){
      return res.status(404).send();
    }
  }
  Transaction.deleteMany({
     _id: {$in: body.ids}
   }).then((transactions)=>{
     res.send(transactions);
   }).catch((e)=>{
    res.status(400).send(e);
   })
})



module.exports={transactionRouter};

