require('dotenv').config()
const jwt = require('jsonwebtoken');
const {UnauthenticatedError} = require('../errors')



const auth = async (req, res, next) => {
    const authHeaders = req.headers.authorization;

    if (!authHeaders || !authHeaders.startsWith('Bearer ')) {
        throw new UnauthenticatedError('Bad authentication')
    }

    const token = authHeaders.split(' ')[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)

        if (!payload) {
            throw new UnauthenticatedError('Bad authentication');
        }

        req.user = payload;
        next();
    } catch(error) {
        throw new UnauthenticatedError(error)
        // console.log(error);
    }
}





module.exports = auth;