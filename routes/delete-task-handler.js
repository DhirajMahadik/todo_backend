import express from "express";
import connect from '../database/config.js';
import verifyToken from '../middlewares/verifyToken.js'
import JWT from 'jsonwebtoken'

const router = express.Router();

router.post('/delete-task', verifyToken, (req, res) => {
    JWT.verify(req.token, process.env.JWT_SECRET, (error, authData) => {
        if (error) res.status(400).send({ error: 'session timeout' });
        connect.query('delete from tasks where task_id = ?', [req.body.task_id], (error, response) => {
            if (error) res.status(400).send({ error: error.message.slice(0, error.message.length - 23) })
            res.send({ message: 'Task deleted successfully' })
        })
    })
})

export default router