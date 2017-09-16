(function(){
	if('geolocation' in navigator){
		navigator.geolocation.getCurrentPosition(function(position) {
			let latitude = position.coords.latitude
			let longitude = position.coords.longitude
			window.location.href = '/userflow/nearme?lat='+latitude+'&long='+longitude
		});
	}else{

	}
})()