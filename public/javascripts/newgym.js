$('#newgym-done-button').click(e=>{
	e.preventDefault()
	let data = $('.chips-autocomplete').material_chip('data')
	var searchParams = new URLSearchParams(window.location.search)
	let gym = searchParams.get('gym')

	let params = {
		equipment: data,
		gym: gym
	}

	jQuery.post("/userflow/save-newgym", params).done(data=>{
		console.log('request successful')
		window.location.href='/userflow/preview?gym'+gym
	})
})