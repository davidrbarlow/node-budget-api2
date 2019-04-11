const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('../server');
const { transactions, populateTransactions } = require('./seed/seed');
const { User } = require('../models/user');
const { Transaction } = require('../models/transaction');

beforeEach(populateTransactions);

describe('GET /transaction/transaction/:id', () => {
  it('should get a transaction by id', (done)=>{
    userId = transactions[0].owner;
    User.findById(userId).then((res)=>{
      const authToken=res.tokens[0].token;
        request(app)
        .get(`/transaction/transaction/${transactions[0]._id}`)
        .set('x-auth',authToken)
        .send()
        .expect(200)
        .expect((res) => {
          expect(res.body.transaction.description).toBe(transactions[0].description);
        }).end((err)=>{
          if (err) {
          return done(err);
          } else {
            done();
          }

        });
    });
  });
});

describe('GET /transaction/', () => {
  it('should get all transactions for a user', (done)=>{
    userId = transactions[0].owner;
    User.findById(userId).then((res)=>{
      const authToken=res.tokens[0].token;
        request(app)
        .get(`/transaction/`)
        .set('x-auth',authToken)
        .send()
        .expect(200)
        .expect((res) => {
         expect(res.body.transactions.length).toBe(2);
        }).end((err)=>{
          if (err) {
          return done(err);
          } else {
            done();
          }

        });
    });
  });
});


describe('POST /transaction/', () => {
  it('should post a transaction for user 2', (done)=>{
    userId = transactions[2].owner;
    User.findById(userId).then((res)=>{
      const authToken=res.tokens[0].token;
        request(app)
        .post(`/transaction/transaction`)
        .set('x-auth',authToken)
        .send(
          {	postedAt: "1551740954000",
          description: "test",
          amount: "1000.00",
          cycle: "Monthly",
          accountType: "Manual"}
        )
        .expect(200)
        .expect((res) => {
          Transaction.count({owner: res.body.owner}).then((res2)=>{
            expect(res2).toBe(2);
          })
        }).end((err)=>{
          if (err) {
          return done(err);
          } else {
            done();
          }

        });
    });
  });
});
