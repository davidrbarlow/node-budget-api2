const express = require('express');
const fileUpload = require('express-fileupload');
const csv = require('fast-csv');
const _ = require('lodash');
var mongoose = require('mongoose');
const {ObjectID} = require('mongodb');
const moment = require('moment');

const transactionRouter = express.Router();

const {Transaction} = require('../models/transaction');

transactionRouter.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Expose-Headers", "x-auth");
  //  res.header("Content-Type : text/plain");
  res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
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

transactionRouter.post('/upload',  (req, res) =>{
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

transactionRouter.get('/', (req,res) =>{
  Transaction.find().then((transactions)=>{
    res.send({transactions})
  }).catch((e)=>{
    res.status(400).send(e);
  })

});

transactionRouter.post('/transaction', (req,res)=>{
  const transaction = new Transaction({
    postedAt: req.body.postedAt,
    description: req.body.description,
    amount: req.body.amount,
    cycle: req.body.cycle,
    accountType: 'NA'
  });
  transaction.save().then((doc)=>{
    res.send(doc);
  }).catch((e) => {
    res.status(400).send(e);
    console.log('post error', e);
  });
});

transactionRouter.get('/transaction/:id', (req,res)=>{
  var id = req.params.id;
  if (!ObjectID.isValid(id)){
    return res.status(404).send();
  }
  Transaction.findOne({
    _id: id
  }).then((transaction)=>{
      if (!transaction){
        res.status(404).send();
      } else{res.send({transaction})}
    }).catch((e) => {
      res.status(400).send();
    })
});






module.exports={transactionRouter};

