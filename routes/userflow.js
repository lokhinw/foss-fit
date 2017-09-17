'use strict'

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
	var async = []
	GMaps.search(latitude, longitude).then(data=>{
		var results = []
		// dude only get the first result for now
		// res.send(data)
		for(let i = 0; i<data['results'].length; i++){
			results.push({
				name: data['results'][i]['name'],
				id: data['results'][i]['id'],
				address: data['results'][i]['vicinity']
			})
			if(data['results'][i]['photos']){
				results[i].photo_reference = data['results'][i]['photos'][0]['photo_reference']
			}
		}

		for(let i = 0; i<data['results'].length; i++){
		//save api requests by only doing 1
		// for(let i = 0; i<1; i++){
			console.log('searching')
			if(!results[i].photo_reference)
				continue;
			async.push(true)
			GPlaces.getPhoto(results[i].photo_reference).then(photo=>{
				results[i].photo = photo.url
				console.log(photo.url)
				async.pop()
			})
		}
		let wait = () =>{
			if(async.length > 0){
				setTimeout(wait, 100)
			}
			else{
				res.render('nearme', {locations: results})
			}
		}
		wait()
	})
})

//userflow index: 2
//this provides the gui for creating a new gym
router.get('/newgym', function(req, res, next) {
	//first do a check to see if the gym exists...
	let gym = req.query.gym
	firebase.database().ref('gyms/'+gym).once('value').then(snapshot=>{
		console.log('querying')
		let data = snapshot.val()
		if(data){
			console.log('redireecting...')
			res.writeHead(302, {
				Location: '/userflow/preferences?gym='+gym
			})
			res.end()
			// res.location(302, '/preferences?gym='+gym)
		}else{
			res.render('newgym')
			//let the user see this page...
		}
	})
});

//this is the post request that the gui sends to save data in a database
router.post('/save-newgym', function(req, res, next) {
	let gym = req.body.gym
	let available_equipment = req.body.equipment
	console.log(available_equipment)
	firebase.database().ref('gyms/'+gym).set({
		equipment: available_equipment
	})
	res.send('success')
});

//userflow index: 4
router.get('/bodypart', function(req, res, next) {
	res.render('bodypart')
});

//userflow index: 5
router.get('/preferences', function(req, res, next) {
	res.render('preferences')
});

//userflow index: 6
router.get('/preview', function(req, res, next){

	var database = firebase.database()
	var data = database.ref().once("value")
	.then(snapshot => snapshot.val())
	.then(data=>{
		res.render('preview')
	});
})

module.exports = router;
