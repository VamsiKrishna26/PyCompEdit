var connection={};

var MongoClient=require('mongodb').MongoClient;
var dbUrl="mongodb+srv://VAMSI:buhm2VXyk@cluster0.ewjb8.mongodb.net/PyCompEdit?retryWrites=true&w=majority";

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