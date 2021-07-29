const { GoogleSpreadsheet } = require("google-spreadsheet");
const { doc, initializeAuth } = require("../controllers/signin.js");
const creds = require("../credentials.json");
require("dotenv").config();

let docs;
exports.createNewDoc = async (req, res) => {
  initializeAuth();
  await doc.loadInfo();
  const sheet = await doc.sheetsByTitle["class"];
  const rows = await sheet.getRows();
  rows.map(async (row) => {
    newDocs = new GoogleSpreadsheet();
    await newDocs.useServiceAccountAuth(creds);
    await newDocs.createNewSpreadsheetDocument({ title: "This is a new doc" });
    console.log(newDocs.spreadsheetId);
    row["docsId"] = newDocs.spreadsheetId;
    await row.save();
    const sheet1 = newDocs.sheetsByIndex[0];
  });
  res.send("good");
};
