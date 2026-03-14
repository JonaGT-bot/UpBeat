import mysql from "mysql2";
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql
.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password : process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
})
.promise();

export async function getUserById(id){
    const [row] =await pool.query(
        `SELECT * FROM users WHERE id = ?`, [id]
    )
    return row[0];
}

export async function getUserByEmail(email){
    const [row] =await pool.query(
        `SELECT * FROM users WHERE email = ?`, [email]
    )
    return row[0];
}

export  async function addUser(name, email, password){

    const [result] = await pool.query(
        `INSERT INTO users (name,email,password) VALUES (?,?,?)`,
        [name,email,password]
    )
    return result.insertId;

}

export async function deleteUser(id){
    const [result] = await pool.query(
        `DELETE FROM users WHERE id = ?`,
        [id]
    )

    return result;

    
}