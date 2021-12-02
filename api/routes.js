
/* routes.js */

import { Router } from 'https://deno.land/x/oak@v6.5.1/mod.ts'

import { extractCredentials, saveFile } from './modules/util.js'
import { login, register } from './modules/accounts.js'
import { addNews, getNews, authorizeNews } from './modules/news.js'

const router = new Router()

// the routes defined here
router.get('/', async context => {
	console.log('GET /')
	const data = await Deno.readTextFile('spa/index.html')
	context.response.body = data
})

router.get('/api/accounts', async context => {
	console.log('GET /api/accounts')
	const token = context.request.headers.get('Authorization')
	console.log(`auth: ${token}`)
	try {
		const credentials = extractCredentials(token)
		console.log(credentials)
//         the user returned here includes userName and id，without pass because pass should not be returned to front-end for security reasons
		const user = await login(credentials)
		console.log(`userr: ${user}`)
		context.response.body = JSON.stringify(
			{
				data: { user }
			}, null, 2)
	} catch(err) {
		context.response.status = 401
		context.response.body = JSON.stringify(
			{
				errors: [
					{
						title: '401 Unauthorized.',
						detail: err.message
					}
				]
			}
		, null, 2)
	}
})

// register
router.post('/api/accounts', async context => {
	console.log('POST /api/accounts')
	const body  = await context.request.body()
	const data = await body.value
	console.log(data)
	await register(data)
	context.response.status = 201
	context.response.body = JSON.stringify({ status: 'success', msg: 'account created' })
})

// add news
router.post('/api/files', async context => {
	console.log('POST /api/files')
	try {
		const token = context.request.headers.get('Authorization')
		console.log(`auth: ${token}`)
		const body  = await context.request.body()
		const data = await body.value
		console.log(data)
        const { file, ...rest } = data
        const { base64, userId } = file
		const fileName = saveFile(base64, userId)
        const imgUrl = `/uploads/${fileName}`
        const date = new Date()
        const releaseDate = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
        await addNews({
            ...rest,
            imgUrl,
            releaseDate,
            userId
        })
		context.response.status = 201
		context.response.body = JSON.stringify(
			{
				data: {
					message: 'file uploaded'
				}
			}
		)
	} catch(err) {
		context.response.status = 400
		context.response.body = JSON.stringify(
			{
				errors: [
					{
						title: 'a problem occurred',
						detail: err.message
					}
				]
			}
		)
	}
})

// get news
router.get('/api/getNews', async context => {
	try {
        const token = context.request.headers.get('Authorization')
        const {user} = extractCredentials(token)
//         check user role
		const result = await getNews(!(user==='Admin'))
        console.log(result)
        context.response.status = 201
		context.response.body = result
	} catch(err) {
		context.response.status = 401
		context.response.body = JSON.stringify(
			{
				errors: [
					{
						title: '401 Unauthorized.',
						detail: err.message
					}
				]
			}
		, null, 2)
	}
})

router.get('/api/authorizeNews', async context => {
	try {
//         get newsId
        const params = {}
        context.request.url.search.slice(1).split('&').map(item=>{
            const [ key, value ] = item.split('=')
            return {
                key,
                value
            }
        }).forEach(({ key, value }) => {
            params[key] = value
        })
        const newsId = params.newsId
        const result = await authorizeNews(newsId)
        console.log(result)
        context.response.status = 201
		context.response.body = result
	} catch(err) {
		context.response.status = 401
		context.response.body = JSON.stringify(
			{
				errors: [
					{
						title: '401 Unauthorized.',
						detail: err.message
					}
				]
			}
		, null, 2)
	}
})

router.get("/(.*)", async context => {      
// 	const data = await Deno.readTextFile('static/404.html')
// 	context.response.body = data
	const data = await Deno.readTextFile('spa/index.html')
	context.response.body = data
})

export default router

