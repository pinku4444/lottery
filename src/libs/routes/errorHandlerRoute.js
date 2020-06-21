const errorHandlerRoute = (err,req,res,next) => {
    if(! err.statusCode) {
        err.statusCode = 500;
    };

    const errorResponse = {
        status : false,
        code: err.statusCode,
        errors: err.msg
    };
    res.status(err.statusCode).json(errorResponse);
}

export default errorHandlerRoute;