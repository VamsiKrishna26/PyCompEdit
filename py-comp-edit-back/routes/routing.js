var express=require("express");
const { verifyJWT } = require("../public/javascripts/PyCompEditDAL");
var routing=express.Router();

var PyCompEditDAL=require('../public/javascripts/PyCompEditDAL');

routing.get('/checkAPI',function(req,res,next){
    PyCompEditDAL.checkAPIConn().then((response)=>{
        res.json(response);
    })
})

routing.post('/submit',function(req,res,next){
    // console.log(req.body.userId,req.body.fileName,req.body.notes)
    PyCompEditDAL.submit(req.body.userId,req.body.fileName,req.body.notes,req.body.source_code,req.body.stdin,req.body.language).then((response)=>{
        res.json(response);
    }).catch(function (err) {
        res.status(400).json({ message: err.message });
    })
})

routing.post('/register',function(req,res,next){
    PyCompEditDAL.register(req.body.email,req.body.password,new Date(),req.body.name).then((response)=>{
        res.json(response);
    }).catch(function (err) {
        res.status(400).json({ message: err.message });
    })
})

routing.post('/login',function(req,res,next){
    PyCompEditDAL.login(req.body.email,req.body.password).then((response)=>{
        res.json(response);
    }).catch(function (err) {
        res.status(400).json({ message: err.message });
    })
})

routing.get('/email',verifyJWT,(req,res)=>{
    res.json({isLoggedIn:true,email:req.user.email});
})

routing.post('/submissions',function(req,res,next){
    PyCompEditDAL.submissions(req.body.userId,req.body.sort,req.body.page,req.body.noOfDocuments).then((response)=>{
        res.json(response);
    }).catch(function (err) {
        res.status(400).json({ message: err.message });
    })
})

routing.post('/pages',function(req,res,next){
    PyCompEditDAL.noOfPages(req.body.noOfDocuments).then((response)=>{
        res.json(response);
    }).catch(function (err) {
        res.status(400).json({ message: err.message });
    })
})

module.exports=routing;