const errorHandler = (err, _, res, next)=>{
    const statusCode = res.statusCode < 400 ? 500 : res.statusCode
    res.status(statusCode)
    res.json({
        message: err.message,
        // stack: processs.env.NODE_ENV ==="production"? null: err.stack,
    })
    next()
}

module.exports = {errorHandler}