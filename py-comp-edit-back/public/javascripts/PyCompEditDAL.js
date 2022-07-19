const axios = require("axios");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
var ObjectId = require("mongodb").ObjectId;
var connection = require("./connection");

var PyCompEditDAL = {};

const language_select = {
  Python: 71,
  Java: 62,
  JavaScript: 63,
  CSharp: 51,
  Cpp: 76,
  C: 48,
};

PyCompEditDAL.checkAPIConn = async function () {
  return await axios
    .get("https://judge0-ce.p.rapidapi.com/about", {
      headers: {
        "X-RapidAPI-Key": "ae615435a2msh56d6b3d25e5d1c6p11491ajsnbefe4ccd3acb",
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
      },
    })
    .then((response) => response.data);
};

PyCompEditDAL.submit = async function (
  userId,
  fileName,
  notes,
  source_code,
  stdin,
  language
) {
  return connection.getConnection().then(async function (db) {
    try {
      source_code = source_code
        ? Buffer.from(source_code).toString("base64")
        : "";
      stdin = stdin ? Buffer.from(stdin).toString("base64") : "";
      var { token } = await axios(
        "https://judge0-ce.p.rapidapi.com/submissions",
        {
          method: "POST",
          params: {
            base64_encoded: "true",
            fields: "*",
          },
          headers: {
            "Content-Type": "application/json",
            "X-RapidAPI-Key":
              "ae615435a2msh56d6b3d25e5d1c6p11491ajsnbefe4ccd3acb",
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          },
          data:
            '{"language_id":' +
            language_select[language] +
            ',"source_code":"' +
            source_code +
            '","stdin":"' +
            stdin +
            '"}',
        }
      )
        .then((response) => response.data)
        .catch(function (error) {
          console.log(error);
        });
      console.log(token);
      let response = await axios
        .get("https://judge0-ce.p.rapidapi.com/submissions/" + token, {
          params: {
            base64_encoded: "true",
            fields: "*",
          },
          headers: {
            "X-RapidAPI-Key":
              "ae615435a2msh56d6b3d25e5d1c6p11491ajsnbefe4ccd3acb",
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          },
        })
        .then((response) => response.data)
        .catch(function (error) {
          console.log(error);
        });
      // console.log(response);
      response.source_code = Buffer.from(
        response.source_code,
        "base64"
      ).toString();
      response.stdin = response.stdin
        ? Buffer.from(response.stdin, "base64").toString()
        : "";
      response.stdout =
        response.stdout || response.compile_output
          ? Buffer.from(
              response.stdout || response.compile_output,
              "base64"
            ).toString()
          : "";
      response.stderr = response.stderr
        ? Buffer.from(response.stderr, "base64").toString()
        : "";
      response.message = response.message
        ? Buffer.from(response.message, "base64").toString()
        : "";
      if (userId) {
        fileName = fileName !== "" || fileName ? fileName : "Script1";
        response.userId = userId;
        response.fileName = fileName;
        response.notes = notes;
        await db.collection("Submissions").updateOne(
          {
            userId: userId,
            fileName: fileName,
            language_id: language_select[language],
          },
          {
            $set: response,
          },
          {
            upsert: true,
          }
        );
      }
      return response;
    } catch {
      throw new Error("Server Dwon/Wall time limit exceeded/Empty Code");
    }
  });
};

PyCompEditDAL.register = async function (email, password, dob, name) {
  return connection.getConnection().then(async function (db) {
    const takenEmail = await db.collection("Users").findOne({
      email: email,
    });
    if (takenEmail) {
      throw new Error("Email address already registered!!");
    } else {
      password = await bcrypt.hash(password, 10);
      await db.collection("Users").insertOne({
        email: email,
        password: password,
        dob: dob,
        name: name,
      });
      return "Success";
    }
  });
};

PyCompEditDAL.login = async function (email, password) {
  return connection.getConnection().then(async function (db) {
    return db
      .collection("Users")
      .findOne({
        email: email,
      })
      .then(async (dbUser) => {
        if (!dbUser) {
          console.log("Hello1");
          throw new Error("Email not found");
        } else {
          return bcrypt.compare(password, dbUser.password).then((isCorrect) => {
            if (!isCorrect) {
              console.log("Hello2");
              throw new Error("Password is incorrect");
            } else {
              const payload = {
                id: dbUser._id,
                email: email,
              };
              return new Promise((resolve, reject) => {
                jwt.sign(
                  payload,
                  process.env.JWT_KEY,
                  {
                    expiresIn: 60,
                  },
                  async (err, token) => {
                    if (err) {
                      console.log(err);
                      reject(err);
                    } else {
                      resolve({
                        userId: dbUser._id,
                        name: dbUser.name,
                        message: "Success",
                        token: "Bearer " + token,
                      });
                    }
                  }
                );
              });
            }
          });
        }
      });
  });
};

PyCompEditDAL.submissions = async function (userId, sort, page, noOfDocuments) {
  if (sort) {
    sort[ObjectId] = 1;
  } else {
    sort = {};
    sort[ObjectId] = 1;
  }
  page = page ? page : 1;
  noOfDocuments = noOfDocuments ? noOfDocuments : 10;
  return connection.getConnection().then(async function (db) {
    return db
      .collection("Submissions")
      .aggregate(
        [
          {
            $match: {
              userId: userId,
            },
          },
          {
            $sort: sort,
          },
          {
            $skip: (page - 1) * noOfDocuments,
          },
          {
            $limit: noOfDocuments ? noOfDocuments : Number.MAX_SAFE_INTEGER,
          },
        ],
        {
          collation: {
            locale: "en",
          },
        }
      )

      .toArray();
  });
};

PyCompEditDAL.noOfPages = async function (noOfDocuments) {
  noOfDocuments = !noOfDocuments ? 5 : noOfDocuments;
  return connection.getConnection().then(async function (db) {
    let documents = await db.collection("Submissions").countDocuments();
    return Math.ceil(documents / noOfDocuments);
  });
};

PyCompEditDAL.deleteSubmission = async function (submissionId) {
  return connection.getConnection().then(async function (db) {
    try {
      await db
        .collection("Submissions")
        .deleteOne({ _id: ObjectId(submissionId) });
      return "Deletion successful";
    } catch {
      throw new Error("Submission ID not present");
    }
  });
};

PyCompEditDAL.discussions = async function (sort, page, noOfDocuments) {
  if (sort) {
    sort[ObjectId] = 1;
  } else {
    sort = {};
    sort[ObjectId] = 1;
  }
  page = page ? page : 1;
  noOfDocuments = noOfDocuments ? noOfDocuments : 10;
  return connection.getConnection().then(async function (db) {
    return db
      .collection("Discussions")
      .aggregate(
        [
          {
            $sort: sort,
          },
          {
            $skip: (page - 1) * noOfDocuments,
          },
          {
            $limit: noOfDocuments ? noOfDocuments : Number.MAX_SAFE_INTEGER,
          },
          {
            $project: {
              _id: 1,
              userId: 1,
              Score: 1,
              CreationDate: 1,
              Title: 1,
              Views: 1,
            },
          },
        ],
        {
          collation: {
            locale: "en",
          },
        }
      )
      .toArray();
  });
};

PyCompEditDAL.noOfPages1 = async function (noOfDocuments) {
  noOfDocuments = !noOfDocuments ? 10 : noOfDocuments;
  return connection.getConnection().then(async function (db) {
    let documents = await db.collection("Discussions").countDocuments();
    return Math.ceil(documents / noOfDocuments);
  });
};

PyCompEditDAL.getDiscussionById = async function (_id) {
  return connection.getConnection().then(function (db) {
    return db.collection("Discussions").findOne({ _id: ObjectId(_id) });
  });
};

PyCompEditDAL.verifyJWT = async function (req, res, next) {
  const token = req.headers["x-access-token"]?.split(" ")[1];
  if (token) {
    jwt.verify(token, process.env.JWT_KEY, async (err, decoded) => {
      if (err) {
        return res.json({
          isLoggedIn: false,
          message: "Failed to Authenticate the user",
        });
      } else {
        req.user = {};
        req.user.id = decoded.id;
        req.user.email = decoded.email;
        next();
      }
    });
  } else {
    return res.json({
      isLoggedIn: false,
      message: "Incorrect Token",
    });
  }
};

PyCompEditDAL.localOperations = async function () {
  return connection.getConnection().then(async function (db) {
    try {
      // // let response = await db.collection("Answers").aggregate([{ "$group": { "_id": "$ParentId", count: { $sum: 1 } } }, { $sort: { count: -1 } },
      // // { "$project": { "ParentId": "$_id", "_id": 0 } }, { $limit: 500 }], { "allowDiskUse": true }).toArray();
      // // let list1=[]
      // // for (var i=0;i<response.length;i++){
      // //     list1.push(response[i]["ParentId"]);
      // // }
      // // let questions= (await db.collection("Questions").deleteMany({"Id":{$nin:list1}}).toArray()).length
      // let dict1 = {}
      // let list1=[]
      // let questionIds = await db.collection("Questions").find({}, { projection: { "Id": 1, _id: 0 } }).toArray();
      // for (var i = 0; i < questionIds.length; i++) {
      //     list1.push(questionIds[i]["Id"]);
      // }
      // let answers=await db.collection("Answers").find({}).toArray()
      // for (var i=0;i<answers.length;i++){
      //     if(Object.keys(dict1).includes(answers[i]["ParentId"])){
      //         dict1[answers[i]["ParentId"]].push(answers[i])
      //     }
      //     else{
      //         dict1[answers[i]["ParentId"]]=[answers[i]]
      //     }
      // }
      // let keys=Object.keys(dict1);
      // for(var i=0;i<keys.length;i++){
      //     await db.collection("Questions").updateMany({"Id":keys[i]},{$set:{"Answers":dict1[keys[i]]}})
      // }
      // db.collection("Discussions").find({}).forEach(async function(doc){
      //     await db.collection("Discussions").updateOne({_id:doc._id},{$set:{"Views":Math.floor(Math.random()*8+3)*doc.Score}});
      // })
      // db.collection("Questions").updateMany({},{$rename:{"OwnerUserId":"userId"}})
      // await db.collection("Questions").updateMany(
      //     { Score : { $type: 2 } },
      //     [{ $set: { Score: { $toInt: "$Score" } } }]
      //   )
      return "Success";
    } catch {
      throw new Error("Submission ID not present");
    }
  });
};

module.exports = PyCompEditDAL;
