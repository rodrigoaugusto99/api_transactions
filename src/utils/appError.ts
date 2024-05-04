class AppError{
    message;
    statusCode;

    constructor(message: String, statusCode = 400){
        this.message = message;
        this.statusCode = statusCode;
    }
}

module.exports = AppError