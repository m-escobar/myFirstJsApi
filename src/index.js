const express = require('express');
const fs = require('fs').promises;
const app = express();
const accountsRouter = require('./routes/accounts.js');
const winston = require('winston');

global.fileName = 'accounts.json';

const { combine, timestamp, label, printf } = winston.format;
const myFormat = printf(({level, message, label, timestamp}) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

global.logger = winston.createLogger({
  level: 'silly',
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({filename: 'my-api.log'})
  ],
  format: combine(
    label({ label: 'myFirst-api'}),
    timestamp(),
    myFormat
  )
});

app.use(express.json());
app.use('/account', accountsRouter);

app.listen(3000, async () => {
  try {
    await fs.readFile(global.fileName, 'utf-8');
    logger.info('API Working');
  } catch(err) {
      const initialJson = {
        nextId: 1,
        accounts: []
      };
      fs.writeFile(global.fileName, JSON.stringify(initialJson)).catch(err => {
        console.log(err);
      });
    }
});
