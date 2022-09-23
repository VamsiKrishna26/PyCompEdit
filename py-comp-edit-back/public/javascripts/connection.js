var connection={};

var MongoClient=require('mongodb').MongoClient;
var dbUrl="mongodb://localhost:27017/PyCompEdit";

var mongoClient=MongoClient.connect(dbUrl);

connection.getConnection=async function(){
    return mongoClient.then(function (db){
        let database=db.db();
        return database;
    }).catch(function(error){
        throw new Error("Could not connect to Database");
    })
}

module.exports=connection;
