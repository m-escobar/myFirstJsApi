var express = require('express');
var app = express();

var fs = require('fs');

var accountsRouter = require('./routes/accounts.js');
global.fileName = 'accounts.json';

app.use(express.json());
app.use('/account', accountsRouter);

app.listen(3000, function() {
  try {
    fs.readFile(global.fileName, 'utf-8', (err, data) => {
      if (err) {
        const initialJson = {
          nextId: 1,
          accounts: []
        };
        fs.writeFile(global.fileName, JSON.stringify(initialJson), err => {
          if (err) {
            console.log(err);
          }
        });
      }
      console.log(err);
      console.log(data);
    });
  } catch (err) {
    console.log(err);
  }

  console.log('API Working');
});
