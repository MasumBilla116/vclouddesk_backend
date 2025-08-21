//@@ external modules
const mongoose =require("mongoose");
require("dotenv").config();


const mongoDB_Url = process.env.MONGODB_URL;


function ConnectDatabase(callback){
    mongoose.connect(mongoDB_Url).then(function(){
        callback(true,"");
    })
    .catch(function(error){
        callback(false),error;
    });
}



module.exports = ConnectDatabase;