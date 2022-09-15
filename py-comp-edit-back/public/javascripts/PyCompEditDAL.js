const axios = require("axios");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
var ObjectId = require("mongodb").ObjectId;
var connection = require("./connection");

var PyCompEditDAL = {};

const language_select = {
  "Python (3.8.1)": 71,
  "Java (OpenJDK 13.0.1)": 62,
  "JavaScript (Node.js 12.14.0)": 63,
  "C# (Mono 6.6.0.161)": 51,
  "C++ (GCC 9.2.0)": 76,
  "C (GCC 9.2.0)": 48,
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

PyCompEditDAL.submit = async function (userId, fileName, notes, source_code, stdin, language) {
  return connection.getConnection().then(async function (db) {
    try {
      source_code = source_code ? Buffer.from(source_code).toString("base64") : "";
      stdin = stdin ? Buffer.from(stdin).toString("base64") : "";
      var { token } = await axios("https://judge0-ce.p.rapidapi.com/submissions", {
        method: "POST",
        params: {
          base64_encoded: "true",
          fields: "*",
        },
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key": <API_Key>,
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
        data: '{"language_id":' + language_select[language] + ',"source_code":"' + source_code + '","stdin":"' + stdin + '"}',
      })
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
            "X-RapidAPI-Key": <API_Key>,
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          },
        })
        .then((response) => response.data)
        .catch(function (error) {
          console.log(error);
        });
      // console.log(response);
      response.source_code = Buffer.from(response.source_code, "base64").toString();
      response.stdin = response.stdin ? Buffer.from(response.stdin, "base64").toString() : "";
      response.stdout = response.stdout || response.compile_output ? Buffer.from(response.stdout || response.compile_output, "base64").toString() : "";
      response.stderr = response.stderr ? Buffer.from(response.stderr, "base64").toString() : "";
      response.message = response.message ? Buffer.from(response.message, "base64").toString() : "";
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
      let insertedId = (
        await db.collection("Users").insertOne({
          email: email,
          password: password,
          dob: dob,
          name: name,
          discussions: [],
          answers: [],
        })
      ).insertedId;
      let userId = ObjectId(insertedId)
        .toString()
        .replace(/[a-zA-z]/g, "")
        .slice(0, 8);
      await db.collection("Users").updateOne({ _id: ObjectId(insertedId) }, { $set: { userId: userId } });
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
          throw new Error("Email/Password is incorrect");
        } else {
          return bcrypt.compare(password, dbUser.password).then((isCorrect) => {
            if (!isCorrect) {
              console.log("Hello2");
              throw new Error("Email/Password is incorrect");
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
                        userId: dbUser.userId,
                        name: dbUser.name,
                        discussions: dbUser.discussions,
                        answers: dbUser.answers,
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

PyCompEditDAL.submissions = async function (userId, sort, page, noOfDocuments, search) {
  if (sort) {
    sort[ObjectId] = 1;
  } else {
    sort = {};
    sort[ObjectId] = 1;
  }
  page = page ? page : 1;
  noOfDocuments = noOfDocuments ? noOfDocuments : 10;
  return connection.getConnection().then(async function (db) {
    return search && search !== ""
      ? db
          .collection("Submissions")
          .aggregate(
            [
              {
                $match: {
                  userId: userId,
                  $text: {
                    $search: search,
                  },
                },
              },
              { $sort: { score: { $meta: "textScore" } } },
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

          .toArray()
      : db
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

PyCompEditDAL.noOfPages = async function (noOfDocuments, userId, search) {
  noOfDocuments = !noOfDocuments ? 5 : noOfDocuments;
  return connection.getConnection().then(async function (db) {
    let documents = 0;
    try {
      if (search && search !== "") {
        documents = (
          await db
            .collection("Submissions")
            .aggregate([
              {
                $match: {
                  userId: userId,
                  $text: {
                    $search: search,
                  },
                },
              },
              {
                $count: "Count",
              },
            ])
            .toArray()
        )[0].Count;
      } else {
        documents = (
          await db
            .collection("Submissions")
            .aggregate([
              {
                $match: {
                  userId: userId,
                },
              },
              {
                $count: "Count",
              },
            ])
            .toArray()
        )[0].Count;
      }
    } catch (e) {
      console.log(e);
      documents = 1;
    }
    return Math.ceil(documents / noOfDocuments);
  });
};

PyCompEditDAL.deleteSubmission = async function (submissionId) {
  return connection.getConnection().then(async function (db) {
    try {
      await db.collection("Submissions").deleteOne({ _id: ObjectId(submissionId) });
      return "Deletion successful";
    } catch {
      throw new Error("Submission ID not present");
    }
  });
};

PyCompEditDAL.discussions = async function (sort, page, noOfDocuments, search) {
  if (sort) {
    sort[ObjectId] = 1;
  } else {
    sort = {};
    sort[ObjectId] = 1;
  }
  page = page ? page : 1;
  noOfDocuments = noOfDocuments ? noOfDocuments : 10;
  return connection.getConnection().then(async function (db) {
    return search && search !== ""
      ? db
          .collection("Discussions")
          .aggregate(
            [
              {
                $match: {
                  $text: {
                    $search: search,
                  },
                },
              },
              { $sort: { score: { $meta: "textScore" } } },
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
                  Answers: 1,
                },
              },
            ],
            {
              collation: {
                locale: "en",
              },
            }
          )
          .toArray()
      : db
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
                  Answers: 1,
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

PyCompEditDAL.noOfPages1 = async function (noOfDocuments, search) {
  noOfDocuments = !noOfDocuments ? 10 : noOfDocuments;
  return connection.getConnection().then(async function (db) {
    let documents = 0;
    if (search && search !== "") {
      try {
        documents = (
          await db
            .collection("Discussions")
            .aggregate([
              {
                $match: {
                  $text: {
                    $search: search,
                  },
                },
              },
              {
                $count: "Count",
              },
            ])
            .toArray()
        )[0].Count;
      } catch (e) {
        console.log(e);
        documents = 1;
      }
    } else {
      documents = await db.collection("Discussions").countDocuments();
    }
    return Math.ceil(documents / noOfDocuments);
  });
};

PyCompEditDAL.getDiscussionById = async function (_id) {
  return connection.getConnection().then(async function (db) {
    let discussion = await db.collection("Discussions").findOne({ _id: ObjectId(_id) });
    if (!discussion) {
      throw new Error("Discussion ID not present");
    }
    return discussion;
  });
};

PyCompEditDAL.addDiscussion = async function (discussion) {
  return connection.getConnection().then(async function (db) {
    discussion.Id = await PyCompEditDAL.getDiscussionId();
    discussion.CreationDate = new Date();
    discussion.Score = 0;
    discussion.Answers = [];
    discussion.Views = 0;
    let discussionId = (await db.collection("Discussions").insertOne(discussion)).insertedId;
    await db.collection("Users").updateOne({ userId: discussion.userId }, { $push: { discussions: discussionId } });
    return discussionId;
  });
};

PyCompEditDAL.getDiscussionId = async function () {
  return connection.getConnection().then(async function (db) {
    let document = await db
      .collection("Discussions")
      .aggregate([{ $sample: { size: 1 } }, { $project: { Id: 1, _id: 0 } }])
      .toArray();
    return String(Math.floor(Math.random() * document[0]["Id"]));
  });
};

PyCompEditDAL.addAnswer = async function (discussionId, answer) {
  return connection.getConnection().then(async function (db) {
    answer.Id = String(Math.floor(Math.random() * 1000000) + 1);
    answer.CreationDate = new Date();
    answer.ParentId = discussionId;
    answer.Score = 0;
    await db.collection("Discussions").updateOne({ Id: discussionId }, { $push: { Answers: answer } });
    let String1 = String(discussionId) + "_" + String(answer.Id);
    await db.collection("Users").updateOne({ userId: answer.userId }, { $push: { answers: String1 } });
    return String1;
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

PyCompEditDAL.addPrograms = async function (language, program) {
  return connection.getConnection().then(async function (db) {
    await db.collection("Programs").updateOne({ language: language }, { $push: { programs: program } }, { upsert: true });
    return "Success";
  });
};

PyCompEditDAL.programs = async function () {
  return connection.getConnection().then(async function (db) {
    let list = await db.collection("Programs").find({}).toArray();
    for (var i = 0; i < list.length; i++) {
      list[i].programs = list[i].programs
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)
        .slice(0, 10);
    }
    return list;
  });
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
      let dict1 = {};
      // let list1=[]
      // let questionIds = await db.collection("Questions").find({}, { projection: { "Id": 1, _id: 0 } }).toArray();
      // for (var i = 0; i < questionIds.length; i++) {
      //     list1.push(questionIds[i]["Id"]);
      // }
      // await db.collection("Answers").deleteMany({"ParentId":{$nin:list1}})
      // let answers=await db.collection("Answers").find({}).toArray()
      // for (var i=0;i<answers.length;i++){
      //     let key=answers[i]["ParentId"]
      //     if(Object.keys(dict1).includes(key)){
      //         dict1[key].push(answers[i])
      //     }
      //     else{
      //         dict1[key]=[answers[i]]
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
      // db.collection("Answers").updateMany({},{$rename:{"OwnerUserId":"userId"}})
      // await db.collection("Answers").updateMany(
      //     {},
      //     [{ $set: { ParentId: { $toString: "$ParentId" } } }]
      //   )
      // await db.collection("Submissions").updateMany({},{$set:{"userId":"62252034"}})
      // await db.collection("Submissions").createIndex( {fileName:"text",language:"text",notes:"text","status.description":"text"},
      //                  { language_override: "dummy" } )
      return "Success";
    } catch (e) {
      throw new Error(e);
    }
  });
};

module.exports = PyCompEditDAL;
