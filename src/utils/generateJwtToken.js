const jwt = require("jsonwebtoken")

async function generateJWT(payload){
    const secreteKey = process.env.JWT_TOKEN_SECRET_KEY;
    const expireDuration = process.env.JWT_TOKEN_EXPIRES_IN || "7d";
    return jwt.sign(payload,secreteKey,{expiresIn:expireDuration})
}


module.exports = generateJWT;