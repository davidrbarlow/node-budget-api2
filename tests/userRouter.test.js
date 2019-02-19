
const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('../server');
const {User} = require('../models/user');
const {users, populateUsers} = require('./seed/seed');


beforeEach(populateUsers);

describe('POST /user', () => {
    it('should create a user', (done)=>{
      var email = 'example@example.com';
      var password = '123mnb!';
  
      request(app)
      .post('/user')
      .send({email,password})
      .expect(200)
      .expect((res)=>{
        expect(res.headers['x-auth']).toBeTruthy();
        expect(res.body._id).toBeTruthy();
        expect(res.body.email).toBe(email);
      }).end((err) => {
        if (err){    
          return done(err);
        }
  
    User.findOne({email}).then((user) =>{
        expect(user).toBeTruthy();
        expect(user.password).not.toBe(password);
        done();
        }).catch((e)=> done(e));
      });
    });

    it ('should throw duplicate error',(done)=>{
        const email = 'abc@123.com';
        const password = 'Test123!';

        request(app)
      .post('/user')
      .send({email,password})
      .expect(400)
      .end(done);
    })
});


describe('POST /user/login', () => {
    it('should login user', (done)=>{
        const email = 'abc@123.com';
        const password = 'Test123!';
        request(app)
        .post('/user/login')
        .send({email,password})
        .expect(200)
        .expect((res)=>{
            expect(res.headers['x-auth']).toBeTruthy();
            expect(res.body._id).toBeTruthy();
            expect(res.body.email).toBe(email);
        }).end((err) => {
            if (err){    
              return done(err);
            }else {done();}
        });
    });
    });

    describe('DELETE /user/logout/token', () => {
      it('should logout user', (done)=>{
        const email = 'abc@123.com';
        User.findOne({email}).then((user)=>{
          console.log('token1********* :', user.tokens[0].token)
            request(app)
            .delete('/user/logout/token')
            .set('x-auth',user.tokens[0].token)
            .send()
            .expect(200)
            //console.log('token2********* :', user.tokens[0].token)
            //.end(done);
            //.end()
            .end((err, res)=>{
              if(err){
                return done(err);
              } else {
                   User.findOne({email}).then((user)=>{
                     console.log(user.tokens.length);
                  expect(user.tokens.length).toBe(0);
                  return done();
                     });
              }
            });
        });
      });
    });

