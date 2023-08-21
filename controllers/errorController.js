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
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    })
}

const errForProd = (err, res) => {

    if (err.isOperational) {
        res.status(err.statusCode).json({
            error: { code: err.statusCode, message: err.message }
        })
    } else {
        res.status(500).json({
            error: { code: 500, message: "server error" }
        })
    }

}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error"
    console.error('ERROR', err)

    if (process.env.NODE_ENV === "development") {
        errorForDev(err, res)
    } else if (process.env.NODE_ENV === "production") {
        let error = { ...err }
        if (error.kind === "ObjectId") error = handleCastError(error)
        if (error.errors) error = handleValidationError(error)
        console.log(error)
        errForProd(err, res)
    }
}