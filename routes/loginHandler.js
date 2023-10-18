import express from 'express';
import connect from '../database/config.js';
import JWT from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const router = express.Router()

router.post('/register', (req, res) => {
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

router.post('/login', (req, res) => {
    const email = req.body.email;
    let query = 'Select password,id from users where email = ?'
    connect.query(query, [email], async (error, response) => {
        if (error) res.status(500).send({ error: 'some error occurs' });
        if (response.length !== 0) {
            let pass = await bcrypt.compare(req.body.password, response[0].password);
            if (pass) {
                let id = response[0].id
                JWT.sign({ id }, process.env.JWT_SECRET, (error, token) => {
                    if (error) res.status(500).send({ error: 'some error occurs' });
                    res.send({ token })
                })
            } else {
                res.status(400).send({ error: 'Invalid user credential' })
            }
        } else {
            res.status(400).send({ error: 'User not found' })
        }

    })

})

export default router