
class AppError extends Error {
    constructor(error, status, code, description, meta) {
        super(error);
        this.status = status;
        this.code = code;
        this.description = description;
        this.meta = meta;
    }
}

module.exports = AppError