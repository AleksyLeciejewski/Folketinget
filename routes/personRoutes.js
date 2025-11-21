const express = require('express');
const router = express.Router();
const controller = require('../controllers/personControllers');
const validation = require('../middlewares/validation');

router.get('/', controller.getAllPeople);

router.get('/politicalParty', controller.getPersonByParty);

router.get('/person/:id', controller.getPersonById);

router.post('/',
    validation.checkDuplicatePerson,
    controller.addPerson);

router.put('/:id',
    validation.validateUpdatePerson,
    controller.updatePerson);

router.delete('/:id', controller.deletePerson);

module.exports = router;