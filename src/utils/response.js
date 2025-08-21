function successResponse(res,message="success",data={},statusCode=200){
    return res.status(statusCode).json({
        status: statusCode,
        type:"success",
        message,
        error:"",
        data,
    });
}

function errorResponse(res,message="error",statusCode=500,error=""){
    return res.status(statusCode).json({
        status: statusCode,
        type:"error",
        message,
        error,
        data:[]
    });
}


module.exports = {
    successResponse,
    errorResponse,
}