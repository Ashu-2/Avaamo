const express = require('express');
var router  = express.Router();
const norvigController = require('../controllers/Norvig');


/**
 * user routes
 */
router.get('/norvig' , norvigController.getData);


module.exports = router;