const router = require('express').Router();
const { register, login, authenticate } = require('../controllers/auth.controllers');
const { restrict } = require('../middlewares/auth.middlewares');

router.post('/register', register);
router.post('/login', login);
router.get('/authenticate', restrict, authenticate);

module.exports = router;