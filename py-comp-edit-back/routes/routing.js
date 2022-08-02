var express = require("express");
const { verifyJWT } = require("../public/javascripts/PyCompEditDAL");
var routing = express.Router();

var PyCompEditDAL = require("../public/javascripts/PyCompEditDAL");

routing.get("/checkAPI", function (req, res, next) {
  PyCompEditDAL.checkAPIConn().then((response) => {
    res.json(response);
  });
});

routing.post("/submit", function (req, res, next) {
  // console.log(req.body.userId,req.body.fileName,req.body.notes)
  PyCompEditDAL.submit(
    req.body.userId,
    req.body.fileName,
    req.body.notes,
    req.body.source_code,
    req.body.stdin,
    req.body.language
  )
    .then((response) => {
      res.json(response);
    })
    .catch(function (err) {
      res.status(400).json({ message: err.message });
    });
});

routing.post("/register", function (req, res, next) {
  PyCompEditDAL.register(
    req.body.email,
    req.body.password,
    new Date(),
    req.body.name
  )
    .then((response) => {
      res.json(response);
    })
    .catch(function (err) {
      res.status(400).json({ message: err.message });
    });
});

routing.post("/login", function (req, res, next) {
  PyCompEditDAL.login(req.body.email, req.body.password)
    .then((response) => {
      res.json(response);
    })
    .catch(function (err) {
      res.status(400).json({ message: err.message });
    });
});

routing.get("/email", verifyJWT, (req, res) => {
  res.json({ isLoggedIn: true, email: req.user.email });
});

routing.post("/submissions", function (req, res, next) {
  PyCompEditDAL.submissions(
    req.body.userId,
    req.body.sort,
    req.body.page,
    req.body.noOfDocuments,
    req.body.search
  )
    .then((response) => {
      res.json(response);
    })
    .catch(function (err) {
      res.status(400).json({ message: err.message });
    });
});

routing.post("/pages", function (req, res, next) {
  PyCompEditDAL.noOfPages(req.body.noOfDocuments,req.body.userId,req.body.search)
    .then((response) => {
      res.json(response);
    })
    .catch(function (err) {
      res.status(400).json({ message: err.message });
    });
});

routing.post("/deleteSubmission", function (req, res, next) {
  PyCompEditDAL.deleteSubmission(req.body.submissionId)
    .then((response) => {
      res.json(response);
    })
    .catch(function (err) {
      res.status(400).json({ message: err.message });
    });
});

routing.post("/discussions", function (req, res, next) {
  PyCompEditDAL.discussions(
    req.body.sort,
    req.body.page,
    req.body.noOfDocuments,
    req.body.search
  )
    .then((response) => {
      res.json(response);
    })
    .catch(function (err) {
      res.status(400).json({ message: err.message });
    });
});

routing.post("/pages1", function (req, res, next) {
  PyCompEditDAL.noOfPages1(req.body.noOfDocuments,req.body.search)
    .then((response) => {
      res.json(response);
    })
    .catch(function (err) {
      res.status(400).json({ message: err.message });
    });
});

routing.get("/getDiscussionById", function (req, res, next) {
  PyCompEditDAL.getDiscussionById(req.query.discussionId)
    .then((response) => {
      res.json(response);
    })
    .catch(function (err) {
      res.status(400).json({ message: err.message });
    });
});

routing.get("/local", function (req, res, next) {
  PyCompEditDAL.localOperations()
    .then((response) => {
      res.json(response);
    })
    .catch(function (err) {
      res.status(400).json({ message: err.message });
    });
});

routing.post("/addDiscussion", function (req, res, next) {
  let discussion={}
  discussion.Title=req.body.title;
  discussion.Body=req.body.discussionBody;
  discussion.userId=req.body.userId;
  PyCompEditDAL.addDiscussion(discussion)
    .then((response) => {
      res.json(response);
    })
    .catch(function (err) {
      res.status(400).json({ message: err.message });
    });
});

routing.post('/addAnswer',function(req,res,next){
  let answer={};
  answer.Body=req.body.answerBody;
  answer.userId=req.body.userId;
  PyCompEditDAL.addAnswer(req.body.discussionId,answer).then((response) => {
    res.json(response);
  })
  .catch(function (err) {
    res.status(400).json({ message: err.message });
  });
})

routing.get('/programs',function(req,res,next){
  PyCompEditDAL.programs().then((response) => {
    res.json(response);
  })
  .catch(function (err) {
    res.status(400).json({ message: err.message });
  });
})

routing.post('/addPrograms',function(req,res,next){
  PyCompEditDAL.addPrograms(req.body.language,req.body.program).then((response) => {
    res.json(response);
  })
  .catch(function (err) {
    res.status(400).json({ message: err.message });
  });
})

module.exports = routing;
