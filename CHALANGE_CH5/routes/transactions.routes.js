var express = require('express');
var router = express.Router();
const { createTransactions, getTransactionsById, updateTransactions, deleteTransactions } = require('../controllers/transactions.controllers');

router.post('/', createTransactions);
router.get('/:id', getTransactionsById);
router.put('/:id', updateTransactions);
router.delete('/:id', deleteTransactions);

module.exports = router;