const express = require("express");
const app = express();
const cors = require("cors");
require('dotenv').config();

app.use(cors());

const singInRoute = require("./routes/signin");
const homeRoutes = require("./routes/home");
const studentListRoutes = require("./routes/studentList.js");
const attendanceRoutes = require("./routes/attendence.js");
const sendMessage = require("./routes/sendMessageForAbsent.js");
// const newDocRouter = require("./routes/createNewDoc.js");

app.use(express.json());
app.use("/", singInRoute);
app.use("/class", homeRoutes);
app.use("/studentList", studentListRoutes);
app.use("/update", attendanceRoutes);
app.use("/sendMessageforAbsent", sendMessage);
// app.use("/newdoc", newDocRouter);



app.listen(process.env.PORT || 3001, () => {
  console.log("server running %s",process.env.PORT || 3001);
});
