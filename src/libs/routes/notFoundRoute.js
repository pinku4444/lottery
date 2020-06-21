const notFoundRoute = (req, res, next) => {
    let error = {
        'msg' : 'url not found',
        'statusCode' : 404
    };

    next(error);
};

export default notFoundRoute;