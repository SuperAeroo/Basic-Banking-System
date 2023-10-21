var express = require('express');
var router = express.Router();
const { createAccounts, getAccountsById, updateAccounts, deleteAccounts } = require('../controllers/accounts.controllers');

router.post('/', createAccounts);
router.get('/:id', getAccountsById);
router.put('/:id', updateAccounts);
router.delete('/:id', deleteAccounts);

module.exports = router;