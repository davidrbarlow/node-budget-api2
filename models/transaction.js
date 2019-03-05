var mongoose = require('mongoose');

var TransactionSchema = new mongoose.Schema({
    description:{
        type: String,
        required: true,
        minlength: 1,
        trim: true
      },
      amount:{
        type: Number,
        default: null,
        required: true
      },
      postedAt:{
        type: Number,
        default: null
      },
      balance:{
        type: Number,
        default: null
      },
      accountType:{
        type: String,
        required: true,
        minlength: 1,
        trim: true
      },
      cycle:{
        type: String,
        required: false,
        minlength: 0,
        trim: true
      }
});

const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports={Transaction};