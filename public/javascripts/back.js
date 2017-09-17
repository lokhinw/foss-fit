$(document).ready(function(){
	'use strict'
	console.log('loaded!')
	console.log(document.getElementById('back-button'))
	$('#back-button').click(e=>{
		console.log('hi')
		e.preventDefault()
		window.history.back()
	})	
})