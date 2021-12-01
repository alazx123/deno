
/* foo.js */

import { customiseNavbar, file2DataURI, loadPage, secureGet, showMessage } from '../util.js'

export async function setup(node) {
	try {
		console.log(node)
		document.querySelector('header p').innerText = 'Add News'
		customiseNavbar(['home', 'logout', 'foo'])
		if(localStorage.getItem('authorization') === null) loadPage('login')
		// there is a token in localstorage
		node.querySelector('form').addEventListener('submit', await uploadData)
	} catch(err) {
		console.error(err)
	}
}

async function uploadData(event) {
	event.preventDefault()
    const formData = new FormData(event.target)
	const data = Object.fromEntries(formData.entries())
    console.log(data)
// 	const element = document.querySelector('input[name="file"]')
	const file = document.querySelector('input[name="file"]').files[0]
	file.base64 = await file2DataURI(file)
	file.userId = localStorage.getItem('userId')
	console.log(file)
	const url = '/api/files'
	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/vnd.api+json',
			'Authorization': localStorage.getItem('authorization')
		},
		body: JSON.stringify(data)
	}
	const response = await fetch(url, options)
	console.log(response)
	const json = await response.json()
	console.log(json)
	showMessage('file uploaded')
	loadPage('home')
}
