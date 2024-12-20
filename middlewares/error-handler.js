const {StatusCodes} = require('http-status-codes')


const errorHandlerMiddleware = async (err, req, res, next) => {
    let customError = {
        msg: err.message || 'Something went wrong, please try again later',
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    }


    return res.status(customError.statusCode).json({success: false, msg: customError.msg})
}





module.exports = errorHandlerMiddleware;