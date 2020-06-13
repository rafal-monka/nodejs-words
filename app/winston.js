const winston = require('winston')

const logger = winston.createLogger({
    // transports: [
    //     new winston.transports.Console()
    // ]
})

if (process.env.NODE_ENV !== '---test') {
    logger.add(new winston.transports.Console({
      format: winston.format.simple(),
    }));
  }

module.exports = logger