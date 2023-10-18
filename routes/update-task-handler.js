import express from "express";
import connect from '../database/config.js';
import JWT from 'jsonwebtoken'
import verifyToken from '../middlewares/verifyToken.js'
const router = express.Router();

router.post('/update-task', verifyToken, (req, res) => {
    JWT.verify(req.token, process.env.JWT_SECRET, (error, authData) => {
        if (error) res.status(400).send({ error: 'session timeout' });
        connect.query('update  tasks set task=? where task_id = ?', [req.body.task, req.body.task_id], (error, response) => {
            if (error) res.status(400).send({ error: error.message.slice(0, error.message.length - 23) })
            res.send({ message: 'Task updated successfully' })
        })
    })
})

export default router