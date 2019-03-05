const express = require('express');
const bodyParser = require('body-parser');


const config = require('./config/config');

const {userRouter} = require('./routes/userRouter');
const {transactionRouter} = require('./routes/transactionRouter');

const port = process.env.PORT || 3000;

var app = express();
app.use(bodyParser.json());


app.use('/user', userRouter);
app.use('/transaction', transactionRouter);

app.listen(port, () =>{
    console.log(`Started on port ${port}`)
});

module.exports={app};
