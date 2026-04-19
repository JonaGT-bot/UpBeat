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

export async function updateUser(id, name, password) {
    // Usamos UPDATE para modificar los registros existentes
    const [result] = await pool.query(
        `UPDATE users SET name = ?, password = ? WHERE id = ?`,
        [name, password, id]
    );
    return result; // Retornamos el resultado de la operación
}