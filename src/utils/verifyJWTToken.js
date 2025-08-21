// @@ extermal modules
const jwt = require("jsonwebtoken");

// @@ internal modules
const {errorResponse} = require("./response");

function verifyJWTToken(req,res,next){
    const authHeader = req.headers['authorization'];
    if(!authHeader) return errorResponse(res,"Unauthorize",401,"No token provided");

    const token = authHeader.split(" ")[1];
    if(!token) return errorResponse(res,"Token missing",401,"Authrization token is missing");
    
    jwt.verify(token,process.env.JWT_TOKEN_SECRET_KEY,function(error,decode){
        if(error) return errorResponse(res,"Invalid Token",403,"Authorization token is invalid");
        res.user = decode;
        next();
    });        
}



module.exports = verifyJWTToken;