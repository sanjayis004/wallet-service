const mongoose = require('mongoose')

const walletSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    balance: {
        type: Number,
        default: 0
    }
});

const WalletModel = mongoose.model('Wallet', walletSchema);

module.exports = WalletModel;