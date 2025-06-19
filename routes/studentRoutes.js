const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
 
router.post('/', studentController.createStudent);
router.get('/', studentController.getAllStudents);
router.put('/:id', studentController.updateStudent);
router.delete('/:id', studentController.deleteStudent);
router.put('/:id/update-cf-handle', studentController.updateCFHandle);

module.exports = router;
