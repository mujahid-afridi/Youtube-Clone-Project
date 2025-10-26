class ApiError extends Error{
    constructor(
        statuscode,
        message='Something went wrong',
        errors = [],
        stack = ""
    ){
        super(message)
        this.statuscode = statuscode
        this.errors = errors
        this.data = null
        this.status = false


        if(stack){
            this.stack = stack;
        }else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export {ApiError}