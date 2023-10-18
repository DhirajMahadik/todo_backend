import express from "express";
import verifyToken from '../middlewares/verifyToken.js'
import JWT from 'jsonwebtoken'
import connect from "../database/config.js";

const router = express.Router();

router.post('/clear-completed-tasks', verifyToken, (req, res) => {

    JWT.verify(req.token, process.env.JWT_SECRET, (error, authData) => {
        if (error) res.status(400).send({ error: 'session timeout' });
        connect.query(' delete  from completed_tasks where user_id = ?', [authData.id], (error, response) => {
            if (error) res.status(400).send({ error: 'Something went wrong' })
            res.send({message:'History cleared successfully'})
        })
    })


})

export default router;