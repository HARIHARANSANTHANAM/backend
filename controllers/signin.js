const { GoogleSpreadsheet } = require("google-spreadsheet");
require("dotenv").config();

let doc;

try {
  doc = new GoogleSpreadsheet(process.env.SHEET_URL);
} catch (err) {
  console.log(err);
}

const initializeAuth = async (newdoc) => {
  await newdoc.useServiceAccountAuth({
    client_email: process.env.CLIENT_EMAIL,
    private_key: process.env.PRIVATE_KEY,
  });
  console.log("initialized");
  // await doc.loadInfo();
  // console.log(doc);
};

signin = async (req, res) => {
  initializeAuth(doc);
  await doc.loadInfo();
  const sheet = doc.sheetsByTitle["creds"];
  const rows = await sheet.getRows();
  if (!req.body.username || !req.body.password) {
    return res.send({ statusmessage: "something went wrong" });
  }
  let getUser = new Promise((resolve, reject) => {
    rows.map((row) => {
      if (row.name === req.body.username) {
        if (row.password === req.body.password) {
          resolve(row);
        } else {
          reject({ statusmessage: "invalid password" });
        }
      }
    });
    reject({ statusmessage: "User not found" });
  });
  getUser
    .then(async (data) => {
      // const classSheet =await doc.sheetsByTitle["class"];
      // const rows = await classSheet.getRows();
      // rows.map((row) => {
      //   if (row.id === data.id) {
      // console.log(row._rawData.slice(1));
      // console.log({class:row.class.split(" ")});
      return res.json({ id: data.id, statusmessage: "ok" }); //return classList
      // }
      // });
      // return res.json({classList:"Still now we didn't get any updates"});
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
};

module.exports = { doc, signin, initializeAuth };
