var express = require('express');
var fs = require('fs');

var router = express.Router();

router.post('/', (req, res) => {
  let account = req.body;

  fs.readFile(global.fileName, 'utf-8', (err, data) => {
    if (!err) {
      try {
        let json = JSON.parse(data);
        account = { id: json.nextId, ...account};

        json.nextId++;
        json.accounts.push(account);

        fs.writeFile(global.fileName, JSON.stringify(json), err => {
          if (err) {
            res.status(400).send({ error: err.message });
          } else {
            res.send({"new_account": account});
          }
        });

      } catch (err) {
          res.status(400).send({ error: err.message });
      }
    } else {
      res.status(400).send({ error: 'Error reading file' });
    }
  });
});

router.get('/', (_, res) => {
  fs.readFile(global.fileName, 'utf-8', (err, data) => {
    if (!err) {
      let json = JSON.parse(data);
      delete json.nextId;
      res.send(json);
    } else {
      res.status(400).send({ error: err.message});
    }
  });
});

router.get('/:id', (req, res) => {
  fs.readFile(global.fileName, 'utf-8', (err, data) => {
    if (!err) {
      let json = JSON.parse(data);
      const account = json.accounts.find(account => account.id === parseInt(req.params.id, 10));

      if (account) {
        res.send(account);
      } else {
        res.status(400).send({error: 'Account not found'});
      }
      
      
    } else {
      res.status(400).send({ error: err.message});
    }
  });
});

module.exports = router;