const { User, validate } = require("../modal/user");
const tryCatcheHanlder = require("../utils/tryCatch");


////////////////////////////////////////
/////////// Create Order 👤 ///////////
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
