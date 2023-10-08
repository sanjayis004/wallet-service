const Wallet = require('../services/wallet')
const Joi = require('@hapi/joi')
const logger = require('../lib/logger').logger
//const Wallet = require('../services/wallet')


module.exports.walletSetup = async(req, res) => {
    try {
        const schema = Joi.object().keys({
            query: {},
            body: {
                balance: Joi.number().optional(),
                name: Joi.string().required()
            }
        }).options({  allowUnknown: true })
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
            let data = {...req.query,...req.body}
            logger.info(data)
            let wallet = new Wallet()
            let walletSetupRes = await wallet.setup(data)
            if(!walletSetupRes ){
                throw "wallet setup failed!"
            }
            return res.json(walletSetupRes)
        }
    } catch (e) {
        logger.info(e)
        return res.json({
            sucess: false,
            error:e
        })

    }
}


module.exports.getWalletById = async(req, res)=>{
    try {
        let walletId = req.params.id
        logger.info(walletId)
        let wallet = new Wallet()
        let walletDetailsRes = await wallet.fetchById(walletId)
        if(!walletDetailsRes ){
            throw "wallet setup failed!"
        }
        return res.json(walletDetailsRes)
        
    }catch(e){
        logger.info(e)
        return res.json({
            sucess: false,
            error:e
        })

    }
}

