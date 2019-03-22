const {ObjectID} = require('mongodb');
const {User} = require('./../../models/user');
const {Transaction} = require('./../../models/transaction');
const jwt = require('jsonwebtoken');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users =[{
    _id: userOneId,
    email: 'abc@123.com',
    password: 'Test123!',
    tokens: [{
      access: 'auth',
      token: jwt.sign({_id: userOneId, access:'auth'},process.env.JWT_SECRET).toString()
    }]
    },{
      _id: userTwoId,
      email: 'bob@example.com',
      password: 'userTwoPass',
      tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userTwoId, access:'auth'},process.env.JWT_SECRET).toString()
      }]
    
    }];

const populateUsers = (done) => {
    User.deleteMany({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();
  
        return Promise.all([userOne, userTwo])
    }).then(()=> done());
  };

const transactionOneId = new ObjectID();
const transactionTwoId = new ObjectID();
const transactionThreeId = new ObjectID();

const transactions = [
  {
    "_id" : transactionOneId,
    "amount" : -385842,
    "postedAt" : 1551427200000.0,
    "balance" : 4113.44,
    "description" : "AMERICAN EXPRESS ACH PMT    W5806           WEB ID: 2005032111",
    "accountType" : "Bank",
    "owner" : userOneId,
    "__v" : 0
},
{
  "_id" : transactionTwoId,
  "amount" : -109634,
  "postedAt" : 1551686400000.0,
  "balance" : 3017.1,
  "description" : "USBANK LOAN      PAYMENT                    PPD ID:  580580574",
  "accountType" : "Bank",
  "owner" : userOneId,
  "__v" : 0,
  "cycle" : "Monthly"
},
{
  "_id" : transactionThreeId,
  "amount" : 100,
  "postedAt" : 1551686400000.0,
  "balance" : 5000,
  "description" : "Test 3",
  "accountType" : "Bank",
  "owner" : userTwoId,
  "__v" : 0,
  "cycle" : "Monthly"
}];

const populateTransactions = (done) => {
  Transaction.deleteMany({}).then(() => {
      const transactionOne = new Transaction(transactions[0]).save();
      const transactionTwo = new Transaction(transactions[1]).save();
      const transactionThree = new Transaction(transactions[2]).save();
      return Promise.all([transactionOne, transactionTwo]);
  }).then(()=> done());
};

  module.exports = {users, populateUsers, transactions, populateTransactions};