import express from 'express'
import cors from 'cors'
import env from 'dotenv'
import connect from './database/config.js'
env.config()
const app = express()
app.use(express.json())
app.use(cors())

import allTaskHandler from './routes/allTaskHandler.js'
import loginHandler from './routes/loginHandler.js'
import addTaskHandler from './routes/add-task.js'
import updateTaskHandler from './routes/update-task-handler.js'
import deleteTaskHandler from './routes/delete-task-handler.js'
import clearCompleteTaskHandler from './routes/clear-completed-task.js'
import completeTaskHandler from './routes/complete-task-handler.js'


app.use('/api',allTaskHandler)

app.use('/api/auth', loginHandler )

app.use('/api', addTaskHandler)

app.use('/api', updateTaskHandler)

app.use('/api', deleteTaskHandler)

app.use('/api', clearCompleteTaskHandler)

app.use('/api', completeTaskHandler)



connect.connect((error)=>{
    if(error) throw error;
    app.listen(process.env.PORT, (error) => {
        if (error) throw error;
        console.log('server is running')
    })
})



