import { db } from './db.js'

export async function addNews(news) {
	const { title, brief, detail, imgUrl, releaseDate, userId } = news
	const sql = `INSERT INTO news(title, brief, detail, imgUrl, releaseDate, userId) VALUES("${title}", "${brief}", "${detail}", "${imgUrl}", "${releaseDate}", "${userId}")`
    console.log(sql)
	await db.query(sql)
	return true
}