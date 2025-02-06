const { User, validate } = require("../modal/user");
const jwt = require("jsonwebtoken");
// const GlobalAppError = require("../utils/globalAppError");
const tryCatcheHanlder = require("../utils/tryCatch");

const createSendToken = (user, res) => {
  const token = jwt.sign(
    { user_id: user._id, dp_user_id: user.dp_user_id },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN
    }
  );
  return res.status(200).json({
    success: true,
    message: "Logined successfully",
    token: {
      token,
      _id: user._id,
      dp_user_id: user.dp_user_id,
      role: user.role
    }
  });
};

//////////////////////////////////////
////// SING UP / REGISTER USER 👤 ////
//////////////////////////////////////
exports.singinAndSignup = tryCatcheHanlder(async (req, res, next) => {
  
  console.log(req.body, "res body------")
   
  const { error } = validate(req.body);

  if (error) {
    return res.status(400).json({
      message: "Invalid data",
      error: error
    });
  }

  const userIsRegistered = await User.findOne({
    dp_user_id: req.body.dp_user_id
  });

  /// if user exist simple allow to him to login
  if (userIsRegistered) {
    return createSendToken(userIsRegistered, res);
  }

  // if user new then save it to database and allow him to login
  const user = await User.create(req.body);

  return createSendToken(user, res);
});



//////////////////////////////////////
////// GET all USER 👤 ////
//////////////////////////////////////
exports.allUser = tryCatcheHanlder(async (req, res, next) => {
  
  
  const userList = await User.find({
    role: "user"
  });

  
  return res.status(200).json({
    success: 1,
    data: userList,
    message: "user list get successfully"
  })
});
