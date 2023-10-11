const common = require('../lib/common.js')
const machineId = 10
const WalletModel = require('../models/wallet.js')
const TransactionModel = require('../models/transaction.js')
const logger = require('../lib/logger').logger
const {
    ObjectId
} = require('mongodb')



class Transaction {
    setupTransaction = async function({walletId,balance}) {
        try {
            let newTransaction = new TransactionModel({
                walletId,
                amount: parseFloat(balance),
                balance: parseFloat(balance),
                type: "CREDIT",
                description: "wallet setup",
                date: new Date()
            })
            let transactionResult = await newTransaction.save()
            return {
                success: true,
                data: {
                    transactionid: transactionResult._id
                }
            }
        } catch (e) {
            logger.error(e)
            return {
                success: false,
                error: e.toString()
            }
        }
    }

    transact = async function({amount,walletId,description}) {
        try {
            logger.info("data | ", {amount,walletId})
            // updating the balance 
            const updateResult = await WalletModel.findOneAndUpdate({
                _id: new ObjectId(walletId)
            }, {
                $inc: {
                    balance: parseFloat(amount)
                }
            }, {
                upsert: true,
                returnDocument: 'before'
            });

            let newTransaction = new TransactionModel({
                walletId,
                amount: parseFloat(amount),
                balance: parseFloat(updateResult.balance) + parseFloat(amount),
                type: amount > 0 ? "CREDIT" : "DEBIT",
                description: description,
                date: new Date()
            })
            let transactionResult = await newTransaction.save()
            logger.info(transactionResult)

            return {
                success: true,
                data: {
                    transactionid: transactionResult._id,
                    balance: parseFloat(updateResult.balance) + parseFloat(amount)
                }
            }
        } catch (e) {
            logger.error(e)
            return {
                success: false,
                error: e.toString()
            }
        }
    }
    transactionsList = async function({
        walletId,
        skip,
        limit,
        sortOrder,
        sortColumn
    }) {
        try {
            logger.info(walletId, skip, limit, sortOrder, sortColumn)
            let sortOrderValue = sortOrder === 'asc' ? 1 : -1
            const pipeline = [{
                    $match: {
                        walletId: walletId
                    }
                }, // Match documents based on the condition
                {
                    $addFields: {
                        type: {
                            $cond: {
                                if: {
                                    $lt: ['$amount', 0]
                                }, // Check if the amount is negative
                                then: 'DEBIT',
                                else: 'CREDIT',
                            },
                        },
                    },
                }, {
                    $sort: {
                        [sortColumn]: sortOrderValue
                    },
                }, {
                    $facet: {
                        transactions: [{
                            $skip: parseInt(skip)
                        }, {
                            $limit: parseInt(limit)
                        }, ],
                        totalCount: [{
                            $count: 'count'
                        }, ],
                    },
                }
            ];
            const documents = await TransactionModel.aggregate(pipeline);
            logger.info(documents)
            return {
                success: true,
                data: documents
            }
        } catch (e) {
            logger.error(e)
            return {
                success: false
            }
        }
    }
}

module.exports = Transaction