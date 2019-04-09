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
      },
      setAsBalance:{
        type: Boolean,
        required: false,
      },
      owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
      }
});

const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports={Transaction};