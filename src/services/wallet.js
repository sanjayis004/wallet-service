const common = require('../lib/common.js')
const machineId = 10
const WalletModel  = require('../models/wallet.js')
const TransactionModel = require('../models/transaction.js')
const TransactionService = require('../services/transaction.js')
const logger = require('../lib/logger').logger
const {ObjectId} = require('mongodb')


class Wallet {

    setup = async function({balance,name}) {
    	try {
    		let newWallet = new WalletModel({name,balance})
	        let result = await newWallet.save()
            let transactionService = new TransactionService()
            let walletId = result._id
            await transactionService.setupTransaction({walletId,balance}) 
	        return {success:true,id:result._id}
    	}catch(e){
    		logger.error("errrr",e)
    		let error = e.code  === 11000 ? "username already in use!" :  "Exception !!"
    		return {success:false,error:error}
    	}
    }
    fetchById = async function(walletId) {
    	try {
    		let result = await WalletModel.findOne({_id:new ObjectId(walletId)})
    		logger.info(result)
    		return {success:true,data:[result]}
    	}catch(e){
    		logger.error(e)
    		return {success:false,error:e.toString()}
    	}
    }


}

module.exports = Wallet