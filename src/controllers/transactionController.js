const Transaction = require('../services/transaction')
const Joi = require('@hapi/joi')
const logger = require('../lib/logger').logger
const TransactionModel = require('../models/transaction')
const fastcsv = require('fast-csv');
//const Wallet = require('../services/wallet')

const csv = require('csv-parser');
const Papa = require('papaparse');
const fs = require('fs');

module.exports.executeTransaction = async(req, res) => {
    try {
        const schema = Joi.object().keys({
            query: {},
            body: {
                amount: Joi.number().required(),
                description: Joi.string().optional()
            }
        }).options({
            allowUnknown: true
        })
        let result = schema.validate({
            query: req.query,
            body: req.body
        })
        let error = result.error
        if (error) {
            return res.json({
                success: false,
                error: result.error.details[0].message,
                message: "",
                data: []
            })
        } else {
            let data = {...req.body,
                ...req.params
            }
            logger.info(data)
            let transaction = new Transaction()
            let transactionRes = await transaction.transact(data)
            if (!transactionRes) {
                throw "wallet setup failed!"
            }
            return res.json(transactionRes)
        }
    } catch (e) {
        logger.info(e)
        return res.json({
            sucess: false,
            error: e
        })

    }
}


module.exports.fetchTransactions = async(req, res) => {
    try {
        const schema = Joi.object().keys({
            query: {
                walletId: Joi.string().required(),
                skip: Joi.number().required(),
                limit: Joi.number().required(),
                sortOrder:Joi.string().required(),
                sortColumn:Joi.string().required()
            },
            body: {}
        }).options({
            allowUnknown: false
        })
        let result = schema.validate({
            query: req.query,
            body: req.body
        })
        let error = result.error
        if (error) {
            return res.json({
                success: false,
                error: result.error.details[0].message,
                message: "",
                data: []
            })
        } else {
            let data = {...req.query,
                ...req.body
            }
            logger.info(data)
            let transaction = new Transaction()
            let transactionRes = await transaction.transactionsList(data)
            if (!transactionRes) {
                throw "wallet setup failed!"
            }
            return res.json(transactionRes)
        }
    } catch (e) {
        logger.info(e)
        return res.json({
            sucess: false,
            error: e
        })

    }
}

module.exports.downloadTransactions = async(req, res) => {
    try {
        res.setHeader('Content-Disposition', 'attachment; filename="users.csv"');
        res.setHeader('Content-Type', 'text/csv');
        logger.info(req.params)
        const cursor = TransactionModel.find({
            walletId: req.params.walletId
        }).cursor();
        
        for (let transaction = await cursor.next(); transaction != null; transaction = await cursor.next()) {
            logger.info(transaction); // Prints documents one at a time
            res.write(JSON.stringify({
                'Transaction ID': transaction._id.toString(),
                'Wallet ID': transaction.walletId,
                'Transaction Type': transaction.type,
                Amount: transaction.amount,
                Balance: transaction.balance,
                Date: transaction.date,
                Description: transaction.description
            }));
            res.write('\n')
        }
        res.end()
    } catch (error) {
        logger.error('Error streaming CSV:', error);
        res.status(500).json({
            error: 'Error streaming CSV'
        });
    }
}