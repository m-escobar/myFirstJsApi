var express = require('express');
var fs = require('fs').promises;

var router = express.Router();

router.post('/', async (req, res) => {
  let account = req.body;
  try {
    let data = await fs.readFile(global.fileName, 'utf-8');
    let json = JSON.parse(data);

    account = { id: json.nextId, ...account};
    json.nextId++;
    json.accounts.push(account);

    await fs.writeFile(global.fileName, JSON.stringify(json));
    
    res.send({"new_account": account});
  } catch (err) {
      res.status(400).send({ error: err.message });
  }
});

router.get('/', async (_, res) => {
  try {
    let data = await fs.readFile(global.fileName, 'utf-8');
    let json = JSON.parse(data);
    delete json.nextId;
    res.send(json);
    } catch (err) {
        res.status(400).send({ error: err.message});
    }
});

router.get('/:id', async (req, res) => {
  try {
    let data = await fs.readFile(global.fileName, 'utf-8');
    let json = JSON.parse(data);
    const account = json.accounts.find(account => account.id === parseInt(req.params.id, 10));

    if (account) {
      res.send(account);
    } else {
      res.status(400).send({error: 'Account not found'});
    }
  } catch {
    res.status(400).send({ error: err.message});
  };
});

router.delete('/:id', async (req, res) => {
  try {
    let data = await fs.readFile(global.fileName, 'utf-8');
    let json = JSON.parse(data);
    let accounts = json.accounts.filter(account => account.id !== parseInt(req.params.id, 10));
    json.accounts = accounts;

    await fs.writeFile(global.fileName, JSON.stringify(json));
    res.send('account deleted');
  } catch {
      res.status(400).send({ error: err.message});
    };
});

router.put('/:id', async (req, res) => {
  try {
    let account = req.body;
    const accountId = parseInt(req.params.id, 10);
    let data = await fs.readFile(global.fileName, 'utf-8');

    let json = JSON.parse(data);
    let accountIndex = json.accounts.findIndex(account => account.id === accountId);
    
    json.accounts[accountIndex].id = accountId;
    json.accounts[accountIndex].name = account.name;
    json.accounts[accountIndex].balance = account.balance;

    await fs.writeFile(global.fileName, JSON.stringify(json));
    res.send('account updated');
    } catch {
      res.status(400).send({ error: err.message});
    };
});

module.exports = router;
