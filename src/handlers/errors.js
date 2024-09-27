const errorHandler = (err, req, res, next) => {
    console.log('enter error')
    res.status(err.status || 500).json({
        message: err.message || 'An error ocurred'
    })
}

module.exports = {
    errorHandler
}