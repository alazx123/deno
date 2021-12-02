
/* home.js */

import { customiseNavbar, secureGet } from '../util.js'

export async function setup(node) {
	console.log('HOME: setup')
	try {
		console.log(node)
		document.querySelector('header p').innerText = 'Home'
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
            imgUrl,
            authorized
        } = news
        const date = new Date(releaseDate)
        const formattedReleaseDate = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
		fragment.querySelector('h2').innerText = title
		fragment.querySelector('.brief p').innerText = brief
        fragment.querySelector('.releaseDate p').innerText = formattedReleaseDate
        fragment.querySelector('img').src = imgUrl
        fragment.querySelector('.status').innerText = authorized ? 'Authorized' : 'New'
//         if the user is Admin, show "Authorize" button
        if(!authorized) {
            const button = document.createElement('button')
            button.innerText = 'Authorize'
            button.classList.add('authorize-button')
            button.addEventListener('click', async ()=>{
                const {affectedRows} = await secureGet(`/api/authorizeNews?newsId=${id}`, authorization)
//                 authorize news successfully
                if(affectedRows === 1) {
//                     refresh the page to update data
                }
            })
            fragment.querySelector('.right').appendChild(button)
        }
        else {
            const link = document.createElement('a')
            link.innerText = 'View Detail'
            link.classList.add('view-detail-link')
            link.href=`/detail?newsId=${id}`
            fragment.querySelector('.right').appendChild(link)
        }
		node.appendChild(fragment) 
	}
}
