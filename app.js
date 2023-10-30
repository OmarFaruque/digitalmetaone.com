const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const sequelize = require("./util/database");
const fileupload = require("express-fileupload");
const env = require('dotenv');

const app = express();

// routes
const userRoute = require("./routes/user");
const mainRoute = require("./routes/main");
const pageRoute = require("./routes/page");
const adminRoute = require("./routes/admin");

// // database tables
const User = require("./models/user");
const Earning = require("./models/earning");
const Referral = require("./models/referral");
const WidthdrawlRequest = require("./models/widthdrawlRequest");
const UpgrageRequest = require("./models/upgradeRequest");

const BoostDetails = require("./models/boostDetails");
const BoostBoard = require("./models/boostBoard");

const Admin = require("./models/admin");
const Company = require("./models/company");

// static files
app.use(express.static(path.join(__dirname, "public")));

// body parser in json
app.use(bodyParser.json());
app.use(fileupload());

// serving routes
app.use("/user", userRoute);
app.use("/main", mainRoute);
app.use("/page", pageRoute);
app.use("/admin", adminRoute);

app.get("/", (req, res, next) => {
  res.redirect("/user/sign_up");
});

// table relations

User.hasMany(Referral);
Referral.belongsTo(User);

User.hasOne(Earning);

User.hasMany(WidthdrawlRequest);
WidthdrawlRequest.belongsTo(User);

User.hasOne(UpgrageRequest);
UpgrageRequest.belongsTo(User);

// updating database

// const updateAll = require('./util/updateDatabase');

// updateAll.createBoostBoardDetails();
// updateAll.createDailyClub();


const PORT = process.env.PORT;
sequelize
      .sync()
      .then((res) => {
        app.listen(3000 || PORT);
        console.log("listening");
      })
      .catch((err) => {
        console.log(err);
      });
