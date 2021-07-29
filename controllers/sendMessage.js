require("dotenv").config();
const fast2sms = require("fast-two-sms");

exports.sendMessage = async (req) => {
  return new Promise((resolve, reject) => {
    var options = {
      authorization: process.env.API_KEY.toString(),
      message: req.message,
      numbers: [req.phone],
    };
    fast2sms
      .sendMessage(options)
      .then((msg) => {
        resolve(msg);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
