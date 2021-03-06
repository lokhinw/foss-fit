const Net = require('./Net')

class GMaps{
	// @returns a Promise containing json straight from google
	static search(latitude, longitude){
		let endpoint = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json'
		let params = {
			key: process.env.GOOGLE_KEY,
			location: latitude+','+longitude,
			rankby: 'distance',
			keyword: 'gym'
		}
		return Net.fetch(endpoint, params).then(result=>{
			return new Promise((resolve, reject)=>{
				resolve(result.json())
			})
		})
	}
}

module.exports = GMaps