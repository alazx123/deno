
/* accounts.js */

import { compare, genSalt, hash } from 'https://deno.land/x/bcrypt@v0.2.4/mod.ts'
import { db } from './db.js'

const saltRounds = 10
const salt = await genSalt(saltRounds)

export async function login(credentials) {
//     user其实是userName
	const { user, pass: password } = credentials
	let sql = `SELECT * FROM accounts WHERE user="${user}";`
	let records = await db.query(sql)
    console.log(records)
	if(!records.length) throw new Error(`username "${user}" not found`)
	const valid = await compare(password, records[0].pass)
    console.log(password)
    console.log(records[0].pass)
	if(valid === false) throw new Error(`invalid password for account "${user}"`)
    const { pass, ...rest } = records[0]
	return rest
}

export async function register(credentials) {
	credentials.pass = await hash(credentials.pass, salt)
	const sql = `INSERT INTO accounts(user, pass) VALUES("${credentials.user}", "${credentials.pass}")`
	console.log(sql)
	await db.query(sql)
	return true
}
