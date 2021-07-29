const { initializeAuth } = require("./signin.js");
const { sendMessage } = require("./sendMessage.js");
// const { newDoc } = require("./fetchClassDetails.js");
const { GoogleSpreadsheet } = require("google-spreadsheet");

require("dotenv").config();

exports.sendMessageForAbsent = async (req, res) => {
  let doc;
  try {
    doc = new GoogleSpreadsheet(req.query.docId);
  } catch (err) {
    console.log(err);
  }
  initializeAuth(doc);
  await doc.loadInfo();
  let studentStatus = req.body;
  const sheet = await doc.sheetsByTitle[
    `${req.query.class} ${req.query.subject}`
  ];

  let responses = [];
  const currentDate = new Date();
  let today = `${currentDate.getDate()}-${
    currentDate.getMonth() + 1
  }-${currentDate.getFullYear()}`;

  const rows = await sheet.getRows();

  let timeFormat =
    ("00" + currentDate.getHours()).slice(-2) +
    ":" +
    ("00" + currentDate.getMinutes()).slice(-2) +
    ":" +
    ("00" + currentDate.getSeconds()).slice(-2);

  let messager = new Promise((resolve, reject) => {
    rows.map(async (row) => {
      studentStatus.map(async (student) => {
        if (row["S. NO"] === student.sno) {
          // row[`${today}`] = student.status;
          if (student.status == "absent") {
            // absentLength = absentLength + 1;
            messageDetails = {
              message: `Your ward, ${row[`NAME OF THE STUDENT`]} of ${
                req.query.class
              } is absent for the ${
                req.query.subject
              } class. ( ${timeFormat} and ${today})`,
              phone: row["PH. NO"],
            };
            // console.log(messageDetails);
            // row["PH. NO"];
            // console.log(messageDetails);

            await sendMessage(messageDetails)
              .then((response) => {
                console.log(response.message);
                responses.push({
                  response: response,
                  details: messageDetails,
                  status: "ok",
                });
              })
              .catch((response) => {
                responses.push({
                  response: response,
                  details: messageDetails,
                  status: "not ok",
                });
              });
            // reject(e);
            // console.log(e);
            // console.log(responses);
          }
        }
      });
    });
    setTimeout(() => {
      resolve({ responses });
    }, 10000);
  });

  messager.then((data) => {
    console.log(data);
    res.send({ errorMessage: data });
  });
  // .catch((e) => {
  //   console.log(e);
  // });
};

// messager.then(data=>{
//   sendMessage(messageDetails, (response) => {
//     //   console.log(response.message);
//     //   responses.push({
//     //     response: response,
//     //     details: messageDetails,
//     //   });
//     // });
// })
