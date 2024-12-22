const CustomAPIError = require('./custom-error');
const {StatusCodes} = require('http-status-codes');



class NotFoundError extends CustomAPIError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.NOT_FOUND;
        this.errCode = 404;
    }
}




module.exports = NotFoundError;