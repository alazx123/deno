import { db } from './db.js'

export async function addNews(news) {
	const { title, brief, detail, imgUrl, releaseDate, userId } = news
	const sql = `INSERT INTO news(title, brief, detail, imgUrl, releaseDate, userId) VALUES("${title}", "${brief}", "${detail}", "${imgUrl}", "${releaseDate}", "${userId}")`
    console.log(sql)
	await db.query(sql)
	return true
}

export async function getNews(authorized=true) {
	const sql = `SELECT a.*, b.user FROM news as a LEFT JOIN accounts as b on a.userId = b.id where authorized = ${authorized}`
	const result = await db.query(sql)
	return result
}

export async function authorizeNews(newsId) {
	const sql = `UPDATE news SET authorized = true where id = ${newsId}`
	const result = await db.query(sql)
	return result
}