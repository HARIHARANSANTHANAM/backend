const { initializeAuth } = require("./signin.js");
// const { sendMessage } = require("./sendMessage.js");
// const { newDoc } = require("./fetchClassDetails.js");
const { GoogleSpreadsheet } = require("google-spreadsheet");
require("dotenv").config();

// let todayHeader;
// function setTodayHeader(today) {
//   todayHeader = today;
//   console.log(todayHeader, "hello");
// }

const updateDatabase = async (req, res) => {
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

  let today = req.query.header;
  console.log(today, req.query.header);
  const rows = await sheet.getRows();
  // let timeFormat =
  //   ("00" + currentDate.getHours()).slice(-2) +
  //   ":" +
  //   ("00" + currentDate.getMinutes()).slice(-2) +
  //   ":" +
  //   ("00" + currentDate.getSeconds()).slice(-2);
  rows.map(async (row) => {
    studentStatus.map(async (student) => {
      if (row["S. NO"] === student.sno) {
        row[`${today}`] = student.status;
        // console.log(today);
        responses.push(row["S. NO"]);
      }
    });
    await row.save();
  });
  if (responses.length === studentStatus.length) {
    return res.send({ responses: responses, statusMessage: "ok" });
  }
  return res.send({
    responses: responses,
    statusMessage: "something went wrong",
  });
};

// if (student.status == "absent") {
//   messageDetails = {
//     message: `Your ward, ${row[`NAME OF THE STUDENT`]} of ${
//       req.query.class
//     } is absent for the ${
//       req.query.subject
//     } class. ( ${timeFormat} and ${today})`,
//     phone: row["PH. NO"],
//   };
//   console.log(messageDetails);
//   sendMessage(messageDetails, (response) => {
//     console.log({ response });
//   });
// }

module.exports = { updateDatabase };
