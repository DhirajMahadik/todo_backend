
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

export default verifyToken;