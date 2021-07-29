// const { GoogleSpreadsheet } = require("google-spreadsheet");
const { doc, initializeAuth } = require("./signin.js");
require("dotenv").config();

exports.fetchClassDetails = async (req, res, next, id) => {
  initializeAuth(doc);
  await doc.loadInfo();
  const sheet = await doc.sheetsByTitle["class"]; //getting class sheet
  const rows = await sheet.getRows();
  let getClassList = new Promise((resolve, reject) => {
    //this is to get a specific row by id
    rows.map((row) => {
      if (row.id === id) {
        resolve(row._rawData.splice(1));
        console.log(row);
      }
    });
    reject("Still now we didn't get any update");
  });

  getClassList
    .then(async (data) => {
      console.log(data[0]);
      const docId = data[0];
      if (await data) {
        let classess = [];
        await data.splice(1).map((cell) => {
          if (cell != "") {
            cell = cell.split(" ");
            classess.push({ class: cell[0], subject: cell[1] });
          }
        });
        req.body = await { classList: classess, docId: docId };
        next();
      } else {
        req.body = await { statusMessage: "no class like that" };
        next();
      }
      // console.log(req.body);
    })
    .catch(async (err) => {
      console.log(err);
      req.body = await { statusMessage: "Still now we didn't get any update" };
      next();
    });
};

exports.sendId = async (req, res) => {
  await console.log(req.body);
  if (req.body.classList) {
    return await res.json({
      classList: req.body.classList,
      docId: req.body.docId,
      statusMessage: "ok",
    });
  }
  return res.json({ classList: [], statusMessage: req.body.statusMessage });
};
