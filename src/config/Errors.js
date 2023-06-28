
const errorCodes = {
    POST_DOES_NOT_EXIST: 'POST_DOES_NOT_EXIST',
}

const errors = {
    POST_DOES_NOT_EXIST: {
        code: 'POST_DOES_NOT_EXIST', 
        status: 400, 
        message: 'Post does not exist',
        description: 'Post does not exist',
    }
}

module.exports = {
    errors,
    errorCodes,
}