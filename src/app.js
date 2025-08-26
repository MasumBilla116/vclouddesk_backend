// @@ External Modeules
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const expressMongoSanitize = require('@exortek/express-mongo-sanitize');

 

// @@ internal modules

const ConnectDatabase = require("./config/database");
const verifyJWTToken = require("./utils/verifyJWTToken");
// @@ 

const HomeRoute = require("./routes/HomeRoute");
const CompanyRoute = require("./routes/CompanyRoute");
const AuthRoute = require("./routes/AuthRoute");


// @@ create app routes
const routes = express();

// @@ start middleware
routes.use(cors());

// @@ Parse request body first
routes.use(express.json());
routes.use(express.urlencoded({ extended: true}));

// @@ Mongo sanitize 
routes.use(expressMongoSanitize());

 


// @@ Rate limit 
const urlAccessLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  message: "Too many requests from this IP, please try again later",
});
routes.use(urlAccessLimiter);

// @@ Hide express version
routes.disable("x-powered-by");

 // @@ start routes section
routes.use(HomeRoute)
routes.use("/api/v1",CompanyRoute)
routes.use("/api/v1",AuthRoute)

// @@ auth routes
routes.use("/api/v1/verify",verifyJWTToken,(req,res,next)=>{
  res.send("verify with token success");
});

routes.use("/api/v1/unverify",(req,res,next)=>{
  res.send("unverified url");
});

// @@ error
routes.use((req,res,next)=>{
    res.send("404");
})


// @@ Server
const PORT = process.env.SERVER_PORT;

ConnectDatabase(function(response,error){
  response ?  routes.listen(PORT,function(){
        console.log(`Server is started in port: ${PORT}`)
    })
    :
    console.warn("Connection is refused: ",error);
});

 