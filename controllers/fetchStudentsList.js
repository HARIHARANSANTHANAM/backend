const { setTodayHeader } = require("./UpdateDatabase.js");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const { initializeAuth } = require("../controllers/signin.js");
require("dotenv").config();

let todayDate;

const headerCheck = async (sheet) => {
  const currentDate = new Date();
  let today = `${currentDate.getDate()}-${
    currentDate.getMonth() + 1
  }-${currentDate.getFullYear()} ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()} ${currentDate.getTime()}`;
  let headers = sheet.headerValues;
  let lastHeaderTime = headers[headers.length - 1].split(" ")[2];
  let lastHeaderMin = lastHeaderTime / 60000 + 45;
  let currentTime = currentDate.getTime() / 60000;
  console.log(
    lastHeaderMin,
    currentTime,
    headers[headers.length - 1].split(" ")[0],
    today.split(" ")[0]
  );
  if (today.split(" ")[0] == headers[headers.length - 1].split(" ")[0]) {
    if (lastHeaderMin > currentTime) {
      today = headers[headers.length - 1];
      todayDate = today;
    } else {
      await headers.push(today);
      await sheet.setHeaderRow(headers);
      todayDate = today;
    }
  } else {
    await headers.push(today);
    await sheet.setHeaderRow(headers);
    todayDate = today;
  }
};

exports.fetchStudentList = async (req, res, next, id) => {
  let doc;
  try {
    doc = new GoogleSpreadsheet(req.query.docId);
  } catch (err) {
    console.log(err);
  }
  initializeAuth(doc);
  await doc.loadInfo();
  if (doc.sheetsByTitle[`${req.query.class} ${req.query.subject}`]) {
    const sheet = await doc.sheetsByTitle[
      `${req.query.class} ${req.query.subject}`
    ];

    const rows = await sheet.getRows();
    headerCheck(sheet);
    const studentList = [];
    rows.map((row) => {
      studentList.push({
        sno: row["S. NO"],
        name: row["NAME OF THE STUDENT"],
        status: "",
      });
    });
    setTimeout(() => {
      req.body = {
        studentList: studentList,
        statusMessage: "ok",
        header: todayDate,
      };
      next();
    }, 1000);
  } else {
    req.body = { statusMessage: "There is no class like that" };
    next();
  }
};

exports.sendId = async (req, res) => {
  // await console.log(req.body);
  if (req.body.studentList) {
    return await res.json(req.body);
  }
  return await res.json({
    studentList: [],
    statusMessage: req.body.statusMessage,
  });
};
