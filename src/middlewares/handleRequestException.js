function handleRequestException(err, req, res, next) {

    const {
        status = 500,
        message,
        code,
        description,
        meta,
    } = err;

    res.status(status).send({
        status: 'error',
        error_code: code,
        message: description || message || 'Something went wrong',
        meta,
    })

    // next(err);
}

module.exports = handleRequestException;