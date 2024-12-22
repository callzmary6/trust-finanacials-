const CustomAPIError = require('./custom-error');
const {StatusCodes} = require('http-status-codes');



class UnauthenticatedError extends CustomAPIError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.UNAUTHORIZED;
        this.errCode = 401;
    }
}




module.exports = UnauthenticatedError;