
import UniversalFunctions from "../../utils/universalFunctions";
import Joi from "joi";
import Controller from "../../controllers";

const adminLogin = {
  method: "POST",
  path: "/api/admin/login",
  options: {
    description: "Admin Login",
    tags: ["api", "admin"],
    handler: (request, h) => {
      return new Promise((resolve, reject) => {
        Controller.AdminBaseController.adminLogin(request.payload, (error, data) => {
          if (error)
            reject(UniversalFunctions.sendError(error));
          else {
            resolve(UniversalFunctions.sendSuccess(null, data));
          }
        });
      });
    },
    validate: {
      payload: Joi.object({
        emailId: Joi.string().email().required(),
        password: Joi.string().required().min(5).trim()
      }).label("Admin: Login"),
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
  method: "POST",
  path: "/api/admin/accessTokenLogin",
  handler: function (request, h) {
    let userData = request?.auth?.credentials?.userData || null;
    (request.auth &&
      request.auth.credentials &&
      request.auth.credentials.userData) ||
      null;
    return new Promise((resolve, reject) => {
      Controller.AdminBaseController.accessTokenLogin(userData, function (
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
  config: {
    description: "access token login",
    tags: ["api", "admin"],
    auth: "UserAuth",
    validate: {
      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        security: [{ 'admin': {} }],
        responseMessages:
          UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};

const createAdmin = {
  method: "POST",
  path: "/api/admin/createAdmin",
  handler: function (request, h) {
    let userData =
      (request.auth &&
        request.auth.credentials &&
        request.auth.credentials.userData) ||
      null;
    let payloadData = request.payload;
    return new Promise((resolve, reject) => {
      if (!UniversalFunctions.verifyEmailFormat(payloadData.emailId)) {
        reject(
          UniversalFunctions.sendError(
            UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR
              .INVALID_EMAIL_FORMAT
          )
        );
      }
      else {
        Controller.AdminBaseController.createAdmin(
          userData,
          payloadData,
          function (err, data) {
            if (!err) {
              resolve(UniversalFunctions.sendSuccess(null, data));
            } else {
              reject(UniversalFunctions.sendError(err));
            }
          }
        );
      }
    });
  },
  options: {
    description: "create sub admin",
    tags: ["api", "admin"],
    auth: "UserAuth",
    validate: {
      payload: Joi.object({
        emailId: Joi.string().required(),
        fullName: Joi.string()
          .optional()
          .allow("")
      }).label("Admin: Create Admin"),
      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        security: [{ 'admin': {} }],
        responseMessages:
          UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};

const getAdmin = {
  method: "GET",
  path: "/api/admin/getAdmin",
  handler: function (request, h) {
    let userData =
      (request.auth &&
        request.auth.credentials &&
        request.auth.credentials.userData) ||
      null;
    return new Promise((resolve, reject) => {
      Controller.AdminBaseController.getAdmin(userData, function (err, data) {
        if (!err) {
          resolve(UniversalFunctions.sendSuccess(null, data));
        } else {
          reject(UniversalFunctions.sendError(err));
        }
      });
    });
  },
  config: {
    description: "get all sub admin list",
    tags: ["api", "admin"],
    auth: "UserAuth",
    validate: {
      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        security: [{ 'admin': {} }],
        responseMessages:
          UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};

const blockUnblockAdmin = {
  method: "PUT",
  path: "/api/admin/blockUnblockAdmin",
  handler: function (request, h) {
    let userData =
      (request.auth &&
        request.auth.credentials &&
        request.auth.credentials.userData) ||
      null;
    let payloadData = request.payload;
    return new Promise((resolve, reject) => {
      Controller.AdminBaseController.blockUnblockAdmin(
        userData,
        payloadData,
        function (err, data) {
          if (!err) {
            resolve(UniversalFunctions.sendSuccess(null, data));
          } else {
            reject(UniversalFunctions.sendError(err));
          }
        }
      );
    });
  },
  options: {
    description: "block/unblock a sub admin",
    tags: ["api", "admin"],
    auth: "UserAuth",
    validate: {
      payload: Joi.object({
        adminId: Joi.string().required(),
        block: Joi.boolean().required()
      }).label("Admin: Block-Unblock Admin"),
      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        security: [{ 'admin': {} }],
        responseMessages:
          UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};

const createUser = {
  method: "POST",
  path: "/api/admin/createUser",
  handler: function (request, h) {
    let userData =
      (request.auth &&
        request.auth.credentials &&
        request.auth.credentials.userData) ||
      null;
    let payloadData = request.payload;
    return new Promise((resolve, reject) => {
      if (!UniversalFunctions.verifyEmailFormat(payloadData.emailId)) {
        reject(
          UniversalFunctions.sendError(
            UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR
              .INVALID_EMAIL_FORMAT
          )
        );
      }
      else {
        Controller.AdminBaseController.createUser(
          userData,
          payloadData,
          function (err, data) {
            if (!err) {
              resolve(UniversalFunctions.sendSuccess(null, data));
            } else {
              reject(UniversalFunctions.sendError(err));
            }
          }
        );
      }
    });
  },
  options: {
    description: "create new user from admin",
    tags: ["api", "admin"],
    auth: "UserAuth",
    validate: {
      payload: Joi.object({
        firstName: Joi.string()
          .regex(/^[a-zA-Z ]+$/)
          .trim()
          .min(2)
          .required(),
        lastName: Joi.string()
          .regex(/^[a-zA-Z ]+$/)
          .trim()
          .min(2)
          .required(),
        emailId: Joi.string().required(),
        phoneNumber: Joi.string()
          .regex(/^[0-9]+$/)
          .min(5)
          .required(),
        countryCode: Joi.string()
          .max(4)
          .required()
          .trim()
      }).label("Admin: Create User"),
      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        security: [{ 'admin': {} }],
        responseMessages:
          UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};

const getUser = {
  method: "GET",
  path: "/api/admin/getUser",
  handler: function (request, h) {
    let userData =
      (request.auth &&
        request.auth.credentials &&
        request.auth.credentials.userData) ||
      null;
    return new Promise((resolve, reject) => {
      Controller.AdminBaseController.getUser(userData, function (err, data) {
        if (!err) {
          resolve(UniversalFunctions.sendSuccess(null, data));
        } else {
          reject(UniversalFunctions.sendError(err));
        }
      });
    });
  },
  options: {
    description: "get all user list",
    tags: ["api", "admin"],
    auth: "UserAuth",
    validate: {
      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        security: [{ 'admin': {} }],
        responseMessages:
          UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};

const blockUnblockUser = {
  method: "PUT",
  path: "/api/admin/blockUnblockUser",
  handler: function (request, h) {
    let userData =
      (request.auth &&
        request.auth.credentials &&
        request.auth.credentials.userData) ||
      null;
    let payloadData = request.payload;
    return new Promise((resolve, reject) => {
      Controller.AdminBaseController.blockUnblockUser(
        userData,
        payloadData,
        function (err, data) {
          if (!err) {
            resolve(UniversalFunctions.sendSuccess(null, data));
          } else {
            reject(UniversalFunctions.sendError(err));
          }
        }
      );
    });
  },
  options: {
    description: "block/unblock a user",
    tags: ["api", "admin"],
    auth: "UserAuth",
    validate: {
      payload: Joi.object({
        userId: Joi.string().required(),
        block: Joi.boolean().required()
      }).label("Admin: Block-Unblock User"),
      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        security: [{ 'admin': {} }],
        responseMessages:
          UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};

const changePassword = {
  method: "PUT",
  path: "/api/admin/changePassword",
  handler: function (request, h) {
    let userData =
      (request.auth &&
        request.auth.credentials &&
        request.auth.credentials.userData) ||
      null;
    return new Promise((resolve, reject) => {
      Controller.AdminBaseController.changePassword(
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
  options: {
    description: "change Password",
    tags: ["api", "customer"],
    auth: "UserAuth",
    validate: {
      payload: Joi.object({
        skip: Joi.boolean().required(),
        oldPassword: Joi.string().when('skip', { is: false, then: Joi.string().required().min(5), otherwise: Joi.string().optional().allow("") }),
        newPassword: Joi.string().when('skip', { is: false, then: Joi.string().required().min(5), otherwise: Joi.string().optional().allow("") })
      }).label("Admin: Change Password"),
      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        security: [{ 'admin': {} }],
        responseMessages:
          UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};

const logoutAdmin = {
  method: "PUT",
  path: "/api/admin/logout",
  options: {
    description: "Logout admin",
    auth: "UserAuth",
    tags: ["api", "admin"],
    handler: function (request, h) {
      let userData =
        (request.auth &&
          request.auth.credentials &&
          request.auth.credentials.userData) ||
        null;
      return new Promise((resolve, reject) => {
        Controller.AdminBaseController.logoutAdmin(userData, function (
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
        security: [{ 'admin': {} }],
        responseMessages:
          UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};

export default [
  adminLogin,
  accessTokenLogin,
  createAdmin,
  getAdmin,
  blockUnblockAdmin,
  createUser,
  getUser,
  blockUnblockUser,
  changePassword,
  logoutAdmin
];
