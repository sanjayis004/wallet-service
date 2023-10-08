const path = require('path')
// const log4js = require('log4js')

const { createLogger, format, transports } = require('winston')
const { combine, timestamp, printf } = format
const rTracer = require('cls-rtracer')

const rTracerFormat = printf((info) => {
  const rid = rTracer.id()
  return rid
    ? `${info.timestamp} [request-id:${rid}]: ${info.message}`
    : `${info.timestamp}: ${info.message}`
})


require('winston-daily-rotate-file')

var _transports = [];

_transports.push(new (transports.DailyRotateFile)({
  name : "file",
  datePattern: 'YYYY-MM-DD-HH',
  filename: path.join(__dirname, '../../logs', 'winston_log_file.log'),
  maxFiles: '14d',
  timestamp: true
}));

_transports.push(new transports.Console());

const winstonLogger = createLogger({
  format: combine(
    timestamp(),
    rTracerFormat
  ),
  level: 'debug',
  transports: _transports
});


const wrapper = ( original ) => {
    return (...args) => {
        var _transformedArgs = [];
        args.forEach((arg) => {
            if( typeof arg == "object" ){
                if( arg instanceof Error){
                    _transformedArgs.push(arg.stack);
                }else{
                    _transformedArgs.push(JSON.stringify(arg));
                }

            }
            else{
                _transformedArgs.push(arg)
            }
        });
        return original(_transformedArgs.join(" "))
    };
};

winstonLogger.error = wrapper(winstonLogger.error);
winstonLogger.warn = wrapper(winstonLogger.warn);
winstonLogger.info = wrapper(winstonLogger.info);
winstonLogger.verbose = wrapper(winstonLogger.verbose);
winstonLogger.debug = wrapper(winstonLogger.debug);
winstonLogger.silly = wrapper(winstonLogger.silly);

var XoXoLogger = {
  log: function(level, message, ...args) {
        // log4jsLogger.log(level, formatMessage(message));
        winstonLogger.log(level, message, ...args);
    },
    error: function(message, ...args) {
        // log4jsLogger.error(formatMessage(message));
        winstonLogger.error(message, ...args)
    },
    warn: function(message, ...args) {
        // log4jsLogger.warn(formatMessage(message));
        winstonLogger.warn(message, ...args);
    },
    info: function(message, ...args) {
        //log4jsLogger.info(formatMessage(message));
        winstonLogger.info(message, ...args);
    },
    debug: function(message, ...args) {
        //log4jsLogger.debug(formatMessage(message));
        winstonLogger.debug('debug', message, ...args);
    }
}

function formatMessage(message) {
  const corrId = httpContext.get('corrId');
  const path = httpContext.get('path');
  message = `[${corrId}][${path}] ${message}`;
  return message;
}

module.exports.logger = XoXoLogger;
