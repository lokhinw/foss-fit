var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/location', function(req, res, next) {
	res.sendFile('location.html')
});

module.exports = router;
