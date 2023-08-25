const AppError = require('./../utils/appError')

const handleCastError = (error) => {
    const message = `Invalid id :${error.value}.`
    return new AppError(message, 400)
}


const handleValidationError = err => {
    const errors = Object.values(err.errors).map(el => el.message)
    const message = `invalid input ${errors.join(', ')}`
    return new AppError(message, 400)
}

const errorForDev = (err, res) => {
    res.status(err.statusCode).json({error:{
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    }})
}

const errForProd = (err, res) => {
        res.status(err.statusCode).json({error:{
            code: err.statusCode, message: err.message 
        }})
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error"

    if (process.env.NODE_ENV === "development") {
        errorForDev(err, res)
    } else if (process.env.NODE_ENV === "production") {
        let error = Object.assign({}, err);
        if (error.kind === "ObjectId") error = handleCastError(error)
        if (error.errors) error = handleValidationError(error)
        
        errForProd(err, res)
    }
}