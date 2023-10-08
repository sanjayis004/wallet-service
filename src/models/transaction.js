const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
    walletId: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    balance: {
    	type: Number,
    	required:true
    },
    type: {
    	type:String,
    	required:true
    },
    description:{
    	type:String
    },
    date: {
        type: Date,
        default: Date.now
    },
});

const Transaction = mongoose.model('Transaction', transactionSchema);


module.exports = Transaction;