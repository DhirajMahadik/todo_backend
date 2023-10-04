const express = require('express')
const cors = require('cors')
const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')
const connect = require('./database/config')

const app = express()
app.use(express.json())
app.use(cors())

// Endpoint for register new user 

app.post('/api/register', (req, res) => {
    try {
        const email = req.body.email;
        bcrypt.hash(req.body.password, 2, (err, hash) => {
            if (err) res.status(500).send({ error: 'some error occurs' });
            connect.query('insert into users(email,password) values(?,?)', [email, hash], (error, response) => {
                if (error) res.status(400).send({ error: error.message.slice(0, error.message.length - 23) })
                res.send(response)
            })
        })

    } catch (error) {
        res.send(error)
    }

})

// Endpoint for login

app.post('/api/login', (req, res) => {
    const email = req.body.email;
    let query = 'Select password,id from users where email = ?'
    connect.query(query, [email], async (error, response) => {
        if (error) res.status(500).send({ error: 'some error occurs' });
        if (response.length !== 0) {
            let pass = await bcrypt.compare(req.body.password, response[0].password);
            if (pass) {
                let id = response[0].id
                JWT.sign({ id }, 'dhiraj', { expiresIn: '900s' }, (error, token) => {
                    if (error) res.status(500).send({ error: 'some error occurs' });
                    res.send({ token })
                })
            } else {
                res.status(404).send({ error: 'Invalid user credential' })
            }
        } else {
            res.status(404).send({ error: 'User not found' })
        }

    })

})

// Verifying token

const verifyToken = (req, res, next) => {
    let token = req.headers['authorization'];
    if (typeof token === 'undefined') {
        res.status(401).send({ error: 'unauthorized user' })
    } else {
        let actualToken = token.split(" ")
        req.token = actualToken[1]
        next()
    }
}

// Endpoind for getting users tasks

app.post('/api/tasks', verifyToken, (req, res) => {

    JWT.verify(req.token, 'dhiraj', (error, authData) => {
        if (error) res.status(400).send({ error: 'session timeout' });
        connect.query('select task, task_id , user_id from tasks where user_id = ?', [authData.id], (error, response) => {
            if (error) res.status(400).send({ error: error.message.slice(0, error.message.length - 23) })
            res.send(response)
        })
    })


})

app.post('/api/completed-tasks', verifyToken, (req, res) => {

    JWT.verify(req.token, 'dhiraj', (error, authData) => {
        if (error) res.status(400).send({ error: 'session timeout' });
        connect.query('select task, task_id  from completed_tasks where user_id = ? order by task_id desc', [authData.id], (error, response) => {
            if (error) res.status(400).send({ error: error.message.slice(0, error.message.length - 23) })
            res.send(response)
        })
    })


})

app.post('/api/clear-completed-tasks', verifyToken, (req, res) => {

    JWT.verify(req.token, 'dhiraj', (error, authData) => {
        if (error) res.status(400).send({ error: 'session timeout' });
        connect.query(' delete  from completed_tasks where user_id = ?', [authData.id], (error, response) => {
            if (error) res.status(400).send({ error: 'Something went wrong' })
            res.send({message:'History cleared successfully'})
        })
    })


})


app.post('/api/add-task', verifyToken, (req, res) => {
    JWT.verify(req.token, 'dhiraj', (error, authData) => {
        if (error) res.status(400).send({ error: 'session timeout' });
        connect.query('insert into tasks (task , user_id) values (?,?)', [req.body.task, authData.id], (error, response) => {
            if (error) res.status(400).send({ error: error.message.slice(0, error.message.length - 23) })
            res.send({ message: 'Task added successfully' })
        })
    })
})

app.post('/api/update-task', verifyToken, (req, res) => {
    JWT.verify(req.token, 'dhiraj', (error, authData) => {
        if (error) res.status(400).send({ error: 'session timeout' });
        connect.query('update  tasks set task=? where task_id = ?', [req.body.task, req.body.task_id], (error, response) => {
            if (error) res.status(400).send({ error: error.message.slice(0, error.message.length - 23) })
            res.send({ message: 'Task updated successfully' })
        })
    })
})

app.post('/api/complete-task', verifyToken, (req, res) => {
    JWT.verify(req.token, 'dhiraj', (error, authData) => {
        if (error) res.status(400).send({ error: 'session timeout' });
        connect.query('delete from tasks where task_id = ?', [req.body.task_id], (error, response) => {
            if (error) res.status(400).send({ error: error.message.slice(0, error.message.length - 23) })
            if (response.affectedRows === 1) {
                connect.query('insert into completed_tasks (task,user_id) values (?,?)', [req.body.task, authData.id], (error, response) => {
                    if (error) res.status(400).send({ error: error.message })
                    res.send({ message: 'Mark as completed successfully' })
                })
            } else {
                res.status(400).send({ error: 'something went wrong' })
            }

        })
    })
})



app.post('/api/delete-task', verifyToken, (req, res) => {
    JWT.verify(req.token, 'dhiraj', (error, authData) => {
        if (error) res.status(400).send({ error: 'session timeout' });
        connect.query('delete from tasks where task_id = ?', [req.body.task_id], (error, response) => {
            if (error) res.status(400).send({ error: error.message.slice(0, error.message.length - 23) })
            res.send({ message: 'Task deleted successfully' })
        })
    })
})

connect.connect((error)=>{
    if(error) throw error;
    app.listen(5500, (error) => {
        if (error) throw error;
        console.log('server is running')
    })
})



