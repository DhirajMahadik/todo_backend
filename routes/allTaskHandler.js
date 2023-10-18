import express from "express";
import verifyToken from '../middlewares/verifyToken.js'
import connect from "../database/config.js";
import JWT from 'jsonwebtoken'
const router = express.Router();

router.post('/tasks', verifyToken, (req, res) => {

    JWT.verify(req.token, process.env.JWT_SECRET, (error, authData) => {
        if (error) res.status(400).send({ error: 'session timeout' });
        connect.query('select task, task_id , user_id from tasks where user_id = ?', [authData.id], (error, response) => {
            if (error) res.status(400).send({ error: error.message.slice(0, error.message.length - 23) })
            res.send(response)
        })
    })

})

router.post('/completed-tasks', verifyToken, (req, res) => {

    JWT.verify(req.token, process.env.JWT_SECRET, (error, authData) => {
        if (error) res.status(400).send({ error: 'session timeout' });
        connect.query('select task, task_id  from completed_tasks where user_id = ? order by task_id desc', [authData.id], (error, response) => {
            if (error) res.status(400).send({ error: error.message.slice(0, error.message.length - 23) })
            res.send(response)
        })
    })


})

export default router