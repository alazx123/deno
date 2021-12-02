
/* home.js */

import { customiseNavbar, secureGet } from '../util.js'

export async function setup(node) {
	console.log('HOME: setup')
	try {
		console.log(node)
		document.querySelector('header p').innerText = 'Home'
		customiseNavbar(['home', 'foo', 'logout']) // navbar if logged in
		const token = localStorage.getItem('authorization')
		if(token === null) customiseNavbar(['home', 'register', 'login']) //navbar if logged out
		// add content to the page
		await addContent(node)
	} catch(err) {
		console.error(err)
	}
}

// this example loads the data from a JSON file stored in the uploads directory
async function addContent(node) {
    const authorization = localStorage.getItem('authorization')
	const response = await secureGet('/api/getNews', authorization)
	const newsList = await response.json
    localStorage.setItem('newsList', JSON.stringify(newsList))
	const template = document.querySelector('template#news-list')
	for(const news of newsList) {
		const fragment = template.content.cloneNode(true)
        const {
            id,
            title,
            brief,
            releaseDate,
            imgUrl
        } = news
        const date = new Date(releaseDate)
        const formattedReleaseDate = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
		fragment.querySelector('h2').innerText = title
		fragment.querySelector('.brief p').innerText = brief
        fragment.querySelector('.releaseDate p').innerText = formattedReleaseDate
        fragment.querySelector('img').src = imgUrl
        fragment.querySelector('.news-container').parentNode.href=`/detail?newsId=${id}`
		node.appendChild(fragment) 
	}
}
