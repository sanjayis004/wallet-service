const express = require('express')
const router = express.Router()

const walletController = require(__dirname+'/../controllers/walletController.js')
const transactionController = require(__dirname+'/../controllers/transactionController.js')


router.post('/setup',walletController.walletSetup)

router.post('/transact/:walletId',transactionController.executeTransaction)

router.get('/transactions',transactionController.fetchTransactions)

router.get('/wallet/:id',walletController.getWalletById)

router.get('/download/:walletId',transactionController.downloadTransactions)

module.exports = router