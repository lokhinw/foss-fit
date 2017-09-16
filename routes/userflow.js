var express = require('express');
var router = express.Router();
const GMaps = require('./../apis/GMaps')
const GPlaces = require('./../apis/GPlaces')

var config = {
	apiKey: "AIzaSyBLaxKzlm4ns10k-q3MRxgP9mPu-L5sfvE",
	authDomain: "exercise-builder.firebaseapp.com",
	databaseURL: "https://exercise-builder.firebaseio.com",
	projectId: "exercise-builder",
	storageBucket: "exercise-builder.appspot.com",
	messagingSenderId: "678132867363"
}

const firebase = (require('firebase')).initializeApp(config)

//userflow index: 1  (go to either 2, 3, OR 4)
router.get('/location', function(req, res, next) {
	res.render('location')
});

router.get('/nearme', function(req, res, next){
	let latitude = req.query.lat
	let longitude = req.query.long
	GMaps.search(latitude, longitude).then(data=>{
		var results = []
		// dude only get the first result for now
		for(let i = 0; i<1; i++){
		// for(let i = 0; i<data['results'].length; i++){
			results.push({
				name: data['results'][i]['name'],
				photo_reference: data['results'][i]['photos'][0]['photo_reference'],
				address: data['results'][i]['vicinity']
			})
		}
		GPlaces.getPhoto(results[0].photo_reference).then(photo=>{
			results[0].photo = photo.url
			res.send(results)
		})
	})
})

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
	
});

//userflow index: 5
router.get('/preview', function(req, res, next){

	var database = firebase.database()
	var data = database.ref().once("value").then(snapshot => snapshot.val()).then(data=>{res.send(data)});
})

module.exports = router;
