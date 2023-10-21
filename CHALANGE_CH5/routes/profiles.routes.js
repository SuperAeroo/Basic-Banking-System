var express = require('express');
var router = express.Router();
const { createProfiles, getProfilesById, updateProfiles, deleteProfiles } = require('../controllers/profiles.controllers');

router.post('/', createProfiles);
router.get('/:id', getProfilesById);
router.put('/:id', updateProfiles);
router.delete('/:id', deleteProfiles);

module.exports = router;