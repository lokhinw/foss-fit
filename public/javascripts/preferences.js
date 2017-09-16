(function(){
	'use strict'
	var duration = 20

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
	slider.noUiSlider.on('update', (values, handle)=>{
		duration = handle
	})

	$('#preferences-next').on('click', e=>{
		e.preventDefault()
		var searchParams = new URLSearchParams(window.location.search)
		let gym = searchParams.get('gym')
		window.location.href = '/userflow/preview?gym='+gym+'&duration='+duration
	})
})()