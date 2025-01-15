const { User } = require("../modal/user");
const jwt = require("jsonwebtoken");
const GlobalAppError = require("../utils/globalAppError");
const tryCatcheHanlder = require("../utils/tryCatch");

const createSendToken = (user, res) => {
  const token = jwt.sign(
    { user_id: user._id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
  return res.status(200).json({
    success: true,
    message: "Logined successfully",
    token: {
      token,
      _id: user._id,
      email: user.email,
     },
  });
};


//////////////////////////////////////
////// SING UP / REGISTER USER 👤 ////
//////////////////////////////////////
exports.register = tryCatcheHanlder(async (req, res, next) => {
  const { error } = validate(req.body);

  const userIsRegistered = await User.findOne({
      email: req.body.email,
  });

  if (userIsRegistered) {
    return next(
      new GlobalAppError("User is already existed", 400)
    );
  }

  if (req.body.referral_code !== null && req.body.referral_code !== undefined ) {
    let referral_codeIsValid = await User.findOne({
      $and: [
        { is_code_verified: true },
        { referral_code: req.body.referral_code },
      ],
    });
    if (!referral_codeIsValid) {
      return next(
        new GlobalAppError(
          `Invalid Referral Code Or UnVerify Refferel User`,
          400
        )
      );
    }
    const user = await User.create({
      ...registerUserObject,
      referred_by: referral_codeIsValid._id,
    });
    if (user) {
      let code = generateVerfiyCode();
      return emailVerification({
        res,
        verification_code: code,
        user,
        template: "registrationCodeVerfiy",
        title: "Registration verification code",
      });

    } else {
      return next(
        new GlobalAppError(`Please try again later some thing error`, 400)
      );
    }
  }

  const user = await User.create(registerUserObject);
  if (user) {
    let code = generateVerfiyCode();
    return emailVerification({
      res,
      verification_code: code,
      user,
      template: "registrationCodeVerfiy",
      title: "Registration verification code",
    });

   
  } else {
    return next(
      new GlobalAppError(`Please try again later some thing error`, 400)
    );
  }
  
});

exports.users = tryCatcheHanlder(async (req, res, next) => {
  const users = await User.find({
    $and: [
      { "role.0": { $ne: "admin" } },
      { delete_status: { $ne: true } },
      { block_status: { $ne: true } },
    ],
  });
  return res.status(200).json({
    success: true,
    message: "get users",
    length: users.length,
    user: {
      users,
    },
  });
});


///////////////////////////////////////////////////////////
///////////////// SINGLE USER DETAIL //////////////
///////////////////////////////////////////////////////////

exports.single_user = tryCatcheHanlder(async (req, res, next) => {
  const user = await User.findOne({ _id: req.params.id });
  if (!user) return next(new GlobalAppError("User is not existed", 400));
  return res.status(200).json({
    success: true,
    message: "get user detail",
    data: {
      user,
    },
  });
});


///////////////////////////////////////////////////////////
///////////////// LOGOUT USER //////////////
///////////////////////////////////////////////////////////

exports.logout = tryCatcheHanlder(async (req, res, next) => {
    const { accessToken, sessionId } = req.body;
  
    // Validate input
    if (!accessToken || !sessionId) {
      return res.status(400).json({
        success: false,
        message: 'accessToken and sessionId are required.',
      });
    }
  
    const options = {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer dyn_9OLzlD2Lyt0oY4pXkvRiKKLELtJUm5U3CDhTt3ggKblFVX34iS2sg2Yi',
        },
      };
    
      try {
        const response = await fetch(`https://app.dynamicauth.com/api/v0/sessions/${sessionId}/revoke`, options);
               console.log( response, " response========")
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Failed to revoke session:', response.status, errorData);
          res.json({
            success: false,
            message: 'Failed to revoke session.',
            error: errorData,
            status: response.status
          });
        }
    
        const result = await response.json();
        res.json({
          success: true,
          message: 'Session successfully revoked.',
          data: result
        });
      } catch (err) {
        console.error('Error during session revocation:', err);
        res.json({
          success: false,
          message: 'An unexpected error occurred.',
          error: err.message
        });
      }
  });
  
  