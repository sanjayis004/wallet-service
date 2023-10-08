const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const router = require('./routes')
const logger = require('./lib/logger').logger
const connectMongo = require('./lib/mongoose')
const config = require('./configs/config.json')


app.use(cors())
app.use(bodyParser({extended : true}))


app.use('/',router)


app.listen(config.port,async()=>{
	await connectMongo()
	logger.info("server started | listening at | ",config.port)
})
