const {StatusCodes} = require('http-status-codes')


const errorHandlerMiddleware = async (err, req, res, next) => {
    let customError = {
        msg: err.message || 'Something went wrong, please try again later',
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        code: err.errCode || 500
    }

    if (err.code && err.code == '11000') {
        customError.msg = 'Email already exists!';
        customError.statusCode = StatusCodes.BAD_REQUEST;
        customError.code = 400;
    }


    return res.status(customError.statusCode).json({success: false, code: customError.code, msg: customError.msg});
}





module.exports = errorHandlerMiddleware;