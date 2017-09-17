(function(){
	'use strict'
	window.workout_duration = 20

	var slider = document.getElementById('test-slider');
	noUiSlider.create(slider, {
		start: [20],
		connect: true,
		step: 5,
        orientation: 'horizontal', // 'horizontal' or 'vertical'
        tooltips: true,
        range: {
        	'min': 10,
        	'max': 90
        }
    })
	slider.noUiSlider.on('update', (value, handle)=>{
		window.workout_duration = parseInt(value)
	})

	$('#preferences-next').on('click', e=>{
		e.preventDefault()
		var searchParams = new URLSearchParams(window.location.search)
		let gym = searchParams.get('gym')
		//FIX THIS DOESNT WORK ALWAYS SAYS THE DURATION IS 0
		window.location.href = '/userflow/preview?gym='+gym+'&duration='+window.workout_duration
	})
})()