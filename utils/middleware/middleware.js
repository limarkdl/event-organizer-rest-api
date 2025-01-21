const contentTypeJsonValidator = (req, res, next) => {
    if (!req.is('application/json')) {
        return res.status(415).json({error: 'Unsupported Media Type'})
    }
    next()
}

const Middleware = {
    contentTypeJsonValidator,
}

export default Middleware