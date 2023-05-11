const express = require("express");
const axios = require("axios");
const mysql = require('./mysql.js');
const app = express();
const port = 5005;
const validate = require('./validatior.js');
const routMember = require('./router/member.js');
const routVaccination = require('./router/vaccination.js');
const routCovid = require('./router/covid.js');

app.use("/members", routMember);
app.use("/vaccination", routVaccination);
app.use("/covids", routCovid);



app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});





