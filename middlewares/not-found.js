const {StatusCodes} = require('http-status-codes');
const {NotFoundError } = require('../errors');

const notFoundMiddleware = async (req, res) => {
    throw new NotFoundError('Route does not exist, check the request method and the url')
}




module.exports = notFoundMiddleware;