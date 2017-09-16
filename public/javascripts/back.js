(function(){
	'use strict'
	$('#back-button').on('click', e=>{
		e.preventDefault()
		window.history.back()
	})
})()