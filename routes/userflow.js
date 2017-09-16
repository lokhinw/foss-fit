var express = require('express');
var router = express.Router();
const GMaps = require('./../apis/GMaps')

//userflow index: 1  (go to either 2, 3, OR 4)
router.get('/location', function(req, res, next) {
	res.render('location')
});

//userflow index: 2
router.get('/newgym', function(req, res, next) {
	res.send('complete this endpoint')
});

//userflow index: 3
router.get('/fromhome', function(req, res, next) {
	res.send('complete this endpoint')
});

//userflow index: 4
router.get('/preferences', function(req, res, next) {
	let latitude = req.query.lat
	let longitude = req.query.long
	GMaps.search(latitude, longitude).then(data=>{
		res.send(data)
	})
});

//userflow index: 5
router.get('/preview', function(req, res, next){
	res.send('complete this endpoint')
})

module.exports = router;
