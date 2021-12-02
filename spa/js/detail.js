
/* home.js */

import { customiseNavbar, secureGet, urlParse } from '../util.js'

export async function setup(node) {
	try {
		console.log(node)
		document.querySelector('header p').innerText = 'Detail'
		customiseNavbar(['home', 'addNews', 'logout']) // navbar if logged in
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
    const template = document.querySelector('template#news-detail')
    const fragment = template.content.cloneNode(true)
    const params = urlParse(window.location.search)
    const newsId = Number(params.newsId)
    const news = JSON.parse(localStorage.getItem('newsList')).find(item=>item.id === newsId)
    const {
        title,
        user,
        brief,
        releaseDate,
        detail,
        imgUrl
    } = news
    const date = new Date(releaseDate)
    const formattedReleaseDate = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
    fragment.querySelector('h2').innerText = title
    fragment.querySelector('.author p').innerText = user
    fragment.querySelector('.brief p').innerText = brief
    fragment.querySelector('.releaseDate p').innerText = formattedReleaseDate
    fragment.querySelector('img').src = imgUrl
    fragment.querySelector('.detail p').innerText = detail
    node.appendChild(fragment)
}
