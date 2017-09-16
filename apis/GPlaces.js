const Net = require('./Net')

class GPlaces{
	// @returns a Promise containing json straight from google
	static getPhoto(photoreference){
		let endpoint = 'https://maps.googleapis.com/maps/api/place/photo'
		let params = {
			key: process.env.GOOGLE_KEY,
			photoreference: photoreference,
			maxheight: 500,
			maxwidth: 500
		}
		return Net.fetch(endpoint, params)
	}
}

module.exports = GPlaces