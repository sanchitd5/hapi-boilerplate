import UniversalFunctions from "../../utils/universalFunctions";
import Joi from "@hapi/joi";
import Controller from "../../controllers";

const userRegister = {
  method: "POST",
  path: "/api/user/register",
  options: {
    description: "Register a new user",
    tags: ["api", "user"],
    handler: (request, h) => {
      const payloadData = request.payload;
      return new Promise((resolve, reject) => {
        if (!UniversalFunctions.verifyEmailFormat(payloadData.emailId))
          reject(
            UniversalFunctions.sendError(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR
              .INVALID_EMAIL_FORMAT)
          );
        else {
          Controller.UserBaseController.createUser(payloadData, (err, data) => {
            if (err) reject(UniversalFunctions.sendError(err));
            else resolve(
              UniversalFunctions.sendSuccess(
                UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS
                  .CREATED,
                data
              )
            );
          });
        }
      });
    },
    validate: {
      payload: Joi.object({
        firstName: Joi.string().regex(/^[a-zA-Z ]+$/).trim().min(2).required(),
        lastName: Joi.string().regex(/^[a-zA-Z ]+$/).trim().min(2).required(),
        emailId: Joi.string().required(),
        phoneNumber: Joi.string().regex(/^[0-9]+$/).min(5).required(),
        countryCode: Joi.string().max(4).required().trim(),
        password: Joi.string().required().min(5)
      }),
      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};

const verifyOTP = {
  method: "PUT",
  path: "/api/user/verifyOTP",
  options: {
    auth: "UserAuth",
    description: "Verify OTP for User",
    tags: ["api", "user"],
    handler: function (request, h) {
      const payloadData = request.payload;
      const userData = (request.auth && request.auth.credentials && request.auth.credentials.userData) || null;
      return new Promise((resolve, reject) => {
        Controller.UserBaseController.verifyOTP({ data: payloadData, userData }, (err, data) => {
          if (err) reject(UniversalFunctions.sendError(err));
          else {
            resolve(
              UniversalFunctions.sendSuccess(
                UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS
                  .VERIFY_COMPLETE,
                data
              )
            );
          }
        });
      });
    },
    validate: {
      payload: Joi.object({
        OTPCode: Joi.string().length(6).required()
      }),
      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        security: [{ 'user': {} }],
        responseMessages:
          UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};

const login = {
  method: "POST",
  path: "/api/user/login",
  options: {
    description: "Login Via Phone Number & Password For User",
    tags: ["api", "user"],
    handler: (request, h) => {
      const payloadData = request.payload;
      if (!UniversalFunctions.verifyEmailFormat(payloadData.emailId)) {
        reject(
          UniversalFunctions.sendError(
            UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR
              .INVALID_EMAIL_FORMAT
          )
        );
      } else {
        return new Promise((resolve, reject) => {
          Controller.UserBaseController.loginUser(payloadData, (err, data) => {
            if (err) reject(UniversalFunctions.sendError(err));
            else resolve(UniversalFunctions.sendSuccess(null, data));
          });
        });
      }
    },
    validate: {
      payload: Joi.object({
        emailId: Joi.string().required(),
        password: Joi.string().required().min(5).trim()
      }),
      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        responseMessages:
          UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};

const resendOTP = {
  method: "PUT",
  path: "/api/user/resendOTP",
  options: {
    description: "Resend OTP for Customer",
    tags: ["api", "customer"],
    auth: "UserAuth",
    handler: function (request, h) {
      const userData =
        (request.auth &&
          request.auth.credentials &&
          request.auth.credentials.userData) ||
        null;
      return new Promise((resolve, reject) => {
        Controller.UserBaseController.resendOTP(userData, function (err, data) {
          if (err) {
            reject(UniversalFunctions.sendError(err));
          } else {
            resolve(
              UniversalFunctions.sendSuccess(
                UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS
                  .VERIFY_SENT,
                data
              )
            );
          }
        });
      });
    },
    validate: {

      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        security: [{ 'user': {} }],
        responseMessages:
          UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};

const getOTP = {
  method: "GET",
  path: "/api/user/getOTP",
  options: {
    description: "get OTP for Customer",
    tags: ["api", "user"],
    handler: function (request, h) {
      const userData = request.query;
      return new Promise((resolve, reject) => {
        Controller.UserBaseController.getOTP(userData, function (
          error,
          success
        ) {
          if (error) {
            reject(UniversalFunctions.sendError(error));
          } else {
            resolve(
              UniversalFunctions.sendSuccess(
                UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS
                  .DEFAULT,
                success
              )
            );
          }
        });
      });
    },
    validate: {
      query: {
        emailId: Joi.string().required()
      },
      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        responseMessages:
          UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};

const accessTokenLogin = {
  /* *****************access token login****************** */
  method: "POST",
  path: "/api/user/accessTokenLogin",

  options: {
    description: "access token login",
    tags: ["api", "user"],
    handler: function (request, h) {
      const userData =
        (request.auth &&
          request.auth.credentials &&
          request.auth.credentials.userData) ||
        null;
      const data = request.payload;
      return new Promise((resolve, reject) => {
        Controller.UserBaseController.accessTokenLogin(userData, function (
          err,
          data
        ) {
          if (!err) {
            resolve(UniversalFunctions.sendSuccess(null, data));
          } else {
            reject(UniversalFunctions.sendError(err));
          }
        });
      });
    },
    auth: "UserAuth",
    validate: {
      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        security: [{ 'user': {} }],
        responseMessages:
          UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};

const logoutCustomer = {
  method: "PUT",
  path: "/api/user/logout",
  options: {
    description: "Logout user",
    auth: "UserAuth",
    tags: ["api", "user"],
    handler: function (request, h) {
      const userData =
        (request.auth &&
          request.auth.credentials &&
          request.auth.credentials.userData) ||
        null;
      return new Promise((resolve, reject) => {
        Controller.UserBaseController.logoutCustomer(userData, function (
          err,
          data
        ) {
          if (err) {
            reject(UniversalFunctions.sendError(err));
          } else {
            resolve(
              UniversalFunctions.sendSuccess(
                UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS
                  .LOGOUT
              )
            );
          }
        });
      });
    },
    validate: {

      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        security: [{ 'user': {} }],
        responseMessages:
          UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};

const getProfile = {
  method: "GET",
  path: "/api/user/getProfile",
  options: {
    description: "get profile of user",
    auth: "UserAuth",
    tags: ["api", "user"],
    handler: function (request, h) {
      const userData =
        (request.auth &&
          request.auth.credentials &&
          request.auth.credentials.userData) ||
        null;
      return new Promise((resolve, reject) => {
        if (userData && userData._id) {
          Controller.UserBaseController.getProfile(userData, function (
            error,
            success
          ) {
            if (error) {
              reject(UniversalFunctions.sendError(error));
            } else {
              resolve(
                UniversalFunctions.sendSuccess(
                  UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS
                    .DEFAULT,
                  success
                )
              );
            }
          });
        } else {
          reject(
            UniversalFunctions.sendError(
              UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR
                .INVALID_TOKEN
            )
          );
        }
      });
    },
    validate: {
      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        security: [{ 'user': {} }],
        responseMessages:
          UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};

const changePassword = {
  method: "PUT",
  path: "/api/user/changePassword",

  options: {
    description: "change Password",
    tags: ["api", "customer"],
    handler: function (request, h) {
      const userData =
        (request.auth &&
          request.auth.credentials &&
          request.auth.credentials.userData) ||
        null;
      return new Promise((resolve, reject) => {
        Controller.UserBaseController.changePassword(
          userData,
          request.payload,
          function (err, user) {
            if (!err) {
              resolve(
                UniversalFunctions.sendSuccess(
                  UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS
                    .PASSWORD_RESET,
                  user
                )
              );
            } else {
              reject(UniversalFunctions.sendError(err));
            }
          }
        );
      });
    },
    auth: "UserAuth",
    validate: {
      payload: Joi.object({
        skip: Joi.boolean().required(),
        oldPassword: Joi.string().when('skip', { is: false, then: Joi.string().required().min(5), otherwise: Joi.string().optional().allow("") }),
        newPassword: Joi.string().when('skip', { is: false, then: Joi.string().required().min(5), otherwise: Joi.string().optional().allow("") })
      }),
      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        security: [{ 'user': {} }],
        responseMessages:
          UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};

const forgotPassword = {
  method: "POST",
  path: "/api/user/forgotPassword",
  options: {
    description: "forgot password",
    tags: ["api", "user"],
    handler: function (request, h) {
      const payloadData = request.payload;
      return new Promise((resolve, reject) => {
        if (!UniversalFunctions.verifyEmailFormat(payloadData.emailId)) {
          reject(
            UniversalFunctions.sendError(
              UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR
                .INVALID_EMAIL_FORMAT
            )
          );
        } else {
          Controller.UserBaseController.forgetPassword(
            request.payload,
            function (error, success) {
              if (error) {
                reject(UniversalFunctions.sendError(error));
              } else {
                resolve(
                  UniversalFunctions.sendSuccess(
                    UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS
                      .VERIFY_SENT,
                    success
                  )
                );
              }
            }
          );
        }
      });
    },
    validate: {
      payload: Joi.object({
        emailId: Joi.string().required()
      }),
      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        responseMessages:
          UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};

const resetPassword = {
  method: "POST",
  path: "/api/user/resetPassword",
  options: {
    description: "reset password",
    tags: ["api", "user"],
    handler: function (request, h) {
      const payloadData = request.payload;
      return new Promise((resolve, reject) => {
        if (!UniversalFunctions.verifyEmailFormat(payloadData.emailId)) {
          reject(
            UniversalFunctions.sendError(
              UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR
                .INVALID_EMAIL_FORMAT
            )
          );
        } else {
          Controller.UserBaseController.resetPassword(request.payload, function (
            error,
            success
          ) {
            if (error) {
              reject(UniversalFunctions.sendError(error));
            } else {
              resolve(
                UniversalFunctions.sendSuccess(
                  UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS
                    .PASSWORD_RESET,
                  success
                )
              );
            }
          });
        }
      });
    },
    validate: {
      payload: Joi.object({
        password: Joi.string()
          .min(6)
          .required()
          .trim(),
        emailId: Joi.string().required(),
        OTPCode: Joi.string().required()
      }),
      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        responseMessages:
          UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};

export default [
  userRegister,
  verifyOTP,
  login,
  resendOTP,
  getOTP,
  accessTokenLogin,
  logoutCustomer,
  getProfile,
  changePassword,
  forgotPassword,
  resetPassword
];
