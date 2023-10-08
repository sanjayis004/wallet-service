const mongoose = require('mongoose');
const logger = require('../lib/logger').logger

const connectMongo = async () => {
  try {
    const conn = await mongoose.connect(`mongodb://0.0.0.0:27017/test`, {
      useNewUrlParser: true,
    });
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(error.message);
    process.exit(1);
  }
}

module.exports = connectMongo