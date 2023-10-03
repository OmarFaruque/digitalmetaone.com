const path = require("path");
const rootDir = require("../util/path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// models
const User = require("../models/user");
const Earning = require("../models/earning");

function generateToken(data) {
  return jwt.sign(data, "secretKey");
}

exports.getSignUpPage = async (req, res) => {
  res.sendFile(path.join(rootDir, "views/user", "sign_up.html"));
};

exports.getSignUp = (req, res, next) => {
  const underId = req.params.underId;
  const side = req.params.side.toUpperCase();

  console.log(req.params);

  res.status(201).send(`
  <!DOCTYPE html>
<html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Sign Up</title>
      <link rel="stylesheet" href="/css/common/sign_up_and_login.css">
  </head>
<body>
    <div class="container">
        <div class="signup-container">

            <form class="signup-form">
                <h1>Join Us</h1>
                <div class="form-group">
                    <input type="text" id="name" name="name" placeholder="Name" required>
                </div>
                <div class="form-group">
                    <input type="email" id="email" name="email" placeholder="Email" required>
                </div>
                <div class="form-group">
                    <input type="number" id="phone" name="phone" placeholder="Mob. NO." required>
                </div>

                <div class="form-group">
                    <input type="text" id="referralId" name="referralId" value="${
                      "USER" + underId + side
                    }" placeholder="Referral Id" required>
                </div>
                
                <div class="form-group">
                    <input type="password" id="password" name="password" placeholder="Password" autocomplete="true" required>
                </div>
                
                <div class="form-btns">
                    <button type="submit" id="sign_up">Sign Up</button>
                    <button type="submit" onclick="{window.location = '/user/login'}">Login</button>
                </div>

            </form>
        </div>
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.19.0/axios.min.js"></script>
    <script src="/js/user/sign_up.js"></script>
</body>
</html>

  `);
};

exports.postSignUp = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });

    const underId = parseInt(req.body.referralId.match(/\d+/g)[0]);

    if (user === null) {
      bcrypt.hash(req.body.password, 10, async (err, hash) => {
        if (err) {
          console.log(err);
        } else {
          const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            password: hash,
            underId: underId,
          });

          // let referingUser = await User.findByPk(underId);

          // referingUser.direct += 1;

          // await referingUser.save();

          await Earning.create({
            total: 0.0,
            today: 0.0,
            direct: 0.0,
            dailyClub: 0.0,
            level: 0.0,
            boost: 0.0,
            widthdrawl: 0.0,
            userId: newUser.id,
          });

          res.status(201).json({ user: newUser, message: "newUser" });
        }
      });
    } else {
      res.status(201).json({ message: "userExist" });
    }
  } catch (err) {
    res.status(403).json({ message: "error", err: err });
    console.log(err);
  }
};

exports.getLogin = (req, res, next) => {
  res.sendFile(path.join(rootDir, "views/user", "login.html"));
};

exports.postLogin = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { email: req.body.email },
      attributes: ["id", "name", "password", "planType"],
    });

    if (user === null) {
      console.log("user not exist");

      res.status(201).json({ message: "userNotExist" });
    } else {
      bcrypt.compare(req.body.password, user.password, async (err, result) => {
        if (err) {
          console.log(err);
        } else if (result === true) {
          res.status(201).json({
            user: {
              id: user.id,
              name: user.name,
              planType: user.planType,
              type: "user",
            },
            message: "loginSuccessfully",
            token: generateToken(user.id),
          });
        } else {
          res.status(201).json({ message: "passwordIncorrect" });
        }
      });
    }
  } catch (err) {
    res.status(400).json({ message: "somthing went wrong" });
    console.log(err);
  }
};

exports.changePassword = async (req, res) => {
  try {
    bcrypt.compare(
      req.body.oldPassword,
      req.user.password,
      async (err, result) => {
        if (err) {
          console.log(err);
        } else if (result === true) {
          bcrypt.hash(req.body.newPassword, 10, async (err, hash) => {
            if (err) {
              res.status(201).json({ message: "error in changing passwor" });
              console.log(err);
            } else {
              req.user.password = hash;
              await req.user.save();

              res.status(201).json({
                message: "got",
                token: generateToken(req.user.id),
              });
            }
          });
        } else {
          res.status(201).json({ message: "wrong" });
        }
      }
    );
  } catch (err) {
    res.status(201).json({ message: "err" });
    console.log(err);
  }
};

exports.getInfo = async (req, res) => {
  try {
    const user = {
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      joiningDate: req.user.createdAt,
    };
    res.status(201).json({ message: "got", info: user });
  } catch (err) {
    console.log(err);
  }
};

async function updateLevel(userId, amount, level) {
  try {
    if (level >= 10) {
      return;
    }

    const user = await User.findByPk(userId, { attributes: ["underId"] });

    if (user === null) {
      return;
    }

    const earning = await Earning.findOne({where: { userId: userId }});

    if(!earning){
      return;
    }

    earning.level += amount;

    await earning.save();

    await updateLevel(user.underId, amount, level + 1);
  } catch (err) {
    console.log("err in updating level income-------",err);
  }
}
exports.upgradePlan = async (req, res) => {
  try {
    const earning = await Earning.findOne({ where: { userId: req.user.id } });

    const parentEarning = await Earning.findOne({
      where: { userId: req.user.underId },
    });

    const available = earning.total - earning.widthdrawl;

    if (req.user.planType === null) {
      res.status(201).json({ message: "not" });
    } else if (req.user.planType === "royal") {
      res.status(201).json({ message: "royal" });
    } else {

      let update = "not";
      let direct = 0;
      let total = 0;
      let level = 0;
      let planType = "";

      switch (req.user.planType) {
        case "starter":
          if (available >= 20) {
            total = 20;
            direct = 10;
            level = 0.4;
            planType = "basic";
            update = "yes";
          }
          break;

        case "basic":
          if (available >= 50) {
            total = 50;
            direct = 10;
            level = 1;
            planType = "star";
            update = "yes";
          }
          break;

        case "star":
          if (available >= 100) {
            total = 100;
            direct = 10;
            level = 2;
            planType = "super star";
            update = "yes";
          }
          break;

        case "super star":
          if (available >= 200) {
            total = 200;
            direct = 10;
            level = 4;
            planType = "prime";
            update = "yes";
          }
          break;

        case "prime":
          if (available >= 500) {
            total = 500;
            direct = 10;
            level = 10;
            planType = "royal";
            update = "yes";
          }
          break;
      }

      if (update === "yes") {
        earning.total -= total;
        req.user.planType = planType;

        await earning.save();
        await req.user.save();

        if(parentEarning !== null){
          parentEarning.direct += direct;
          await parentEarning.save();
        }

        await updateLevel(req.user.underId, level, 1);

        res.status(201).json({ message: "done" });
      } else {
        res.status(201).json({ message: "notenough" });
      }
    }
  } catch (err) {
    res.status(201).json({ message: "error" });
    console.log("err in updating plan", err);
  }
};

exports.getImage = async (req, res) => {
  try {
    console.log("geting image");

    const user = await User.findOne({
      where: { id: req.params.userId },
      attributes: ["photo"],
    });

    res.send(user.photo);
  } catch (err) {
    console.log("err in geting user image", err);
  }
};

exports.uploadImage = async (req, res) => {
  try {
    console.log("geting image");

    const user = await User.findOne({ where: { id: req.user.id } });

    user.photo = req.files.file.data;

    await user.save();

    res.status(201).json({ message: "got" });
  } catch (err) {
    console.log("err in geting user image", err);
  }
};
