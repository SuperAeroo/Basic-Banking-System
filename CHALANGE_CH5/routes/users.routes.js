var express = require('express');
var router = express.Router();
const { createUsers, getUsersById, updateUsers, deleteUsers } = require('../controllers/users.controllers');

router.post('/', createUsers);
router.get('/:id', getUsersById);
router.put('/:id', updateUsers);
router.delete('/:id', deleteUsers);

module.exports = router;
