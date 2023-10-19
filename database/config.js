import mysql from 'mysql2'
import env from 'dotenv'
env.config()

const connect = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
})

// database details for your reference 

    // Tables = users, tasks, completed_tasks 

    // columns in tables = {
    //     users = id,email,password
    //     tasks = user_id, task, task_id
    //     completed_tasks = user_id, task, task_id
    // }


export default connect