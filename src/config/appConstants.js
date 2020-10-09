

"use strict";
var SOCIAL = {
  FACEBOOK: "FACEBOOK"
};
var swaggerDefaultResponseMessages = [
  { code: 200, message: "OK" },
  { code: 400, message: "Bad Request" },
  { code: 401, message: "Unauthorized" },
  { code: 404, message: "Data Not Found" },
  { code: 500, message: "Internal Server Error" }
];
const DATABASE = {
  DEVICE_TYPES: {
    ANDROID: "ANDROID",
    IOS: "IOS"
  },
  USER_ROLES: {
    USER: "USER",
    SUPERADMIN: "SUPERADMIN",
    ADMIN: "ADMIN"
  }
};

var STATUS_MSG = {
  ERROR: {
    DEFAULT: {
      statusCode: 400,
      customMessage: "Error",
      type: "DEFAULT"
    },
    APP_ERROR: {
      statusCode: 400,
      customMessage: 'Application error',
      type: 'APP_ERROR'
    },
    DB_ERROR: {
      statusCode: 400,
      customMessage: 'DB Error : ',
      type: 'DB_ERROR'
    },
    INVALID_ID: {
      statusCode: 400,
      customMessage: 'Invalid id provided : ',
      type: 'INVALID_ID'
    },
    DUPLICATE: {
      statusCode: 400,
      customMessage: 'Duplicate entry',
      type: 'DUPLICATE'
    },
    USER_ALREADY_REGISTERED: {
      statusCode: 409,
      customMessage: "You are already registered with us",
      type: "USER_ALREADY_REGISTERED"
    },
    FACEBOOK_ID_PASSWORD_ERROR: {
      statusCode: 400,
      customMessage:
        "Only one field should be filled at a time, either facebookId or password",
      type: "FACEBOOK_ID_PASSWORD_ERROR"
    },
    PASSWORD_REQUIRED: {
      statusCode: 400,
      customMessage: "Password is required",
      type: "PASSWORD_REQUIRED"
    },
    INVALID_COUNTRY_CODE: {
      statusCode: 400,
      customMessage: "Invalid Country Code, Should be in the format +52",
      type: "INVALID_COUNTRY_CODE"
    },
    INVALID_PHONE_NO_FORMAT: {
      statusCode: 400,
      customMessage: "Phone no. cannot start with 0",
      type: "INVALID_PHONE_NO_FORMAT"
    },
    IMP_ERROR: {
      statusCode: 500,
      customMessage: "Implementation Error",
      type: "IMP_ERROR"
    },
    UNIQUE_CODE_LIMIT_REACHED: {
      statusCode: 400,
      customMessage: "Cannot Generate Unique Code, All combinations are used",
      type: "UNIQUE_CODE_LIMIT_REACHED"
    },
    PHONE_NO_EXIST: {
      statusCode: 400,
      customMessage: "Mobile No. Already Exist",
      type: "PHONE_NO_EXIST"
    },
    EMAIL_NO_EXIST: {
      statusCode: 400,
      customMessage: "Email Address Already Exist",
      type: "EMAIL_NO_EXIST"
    },
    USERNAME_EXIST: {
      statusCode: 400,
      customMessage: "User Already Exist",
      type: "USERNAME_EXIST"
    },
    INVALID_TOKEN: {
      statusCode: 401,
      customMessage: "Invalid token provided",
      type: "INVALID_TOKEN"
    },
    INCORRECT_ACCESSTOKEN: {
      statusCode: 403,
      customMessage: "Incorrect AccessToken",
      type: "INCORRECT_ACCESSTOKEN"
    },
    INVALID_CODE: {
      statusCode: 400,
      customMessage: "Invalid Verification Code",
      type: "INVALID_CODE"
    },
    USER_NOT_FOUND: {
      statusCode: 400,
      customMessage: "User Not Found",
      type: "USER_NOT_FOUND"
    },
    INCORRECT_PASSWORD: {
      statusCode: 400,
      customMessage: "Incorrect Password",
      type: "INCORRECT_PASSWORD"
    },
    ACCOUNT_BLOCKED: {
      statusCode: 400,
      customMessage: "You account has been blocked by authorities. Please Contact them.",
      type: "ACCOUNT_BLOCKED"
    },
    PRIVILEGE_MISMATCH: {
      statusCode: 400,
      customMessage: "Your account doesnt have this privileges",
      type: "PRIVILEGE_MISMATCH"
    },
    NOT_REGISTERED: {
      statusCode: 400,
      customMessage:
        "You are not registered with Us. Kindly register yourself to avail services!",
      type: "NOT_REGISTERED"
    },
    FACEBOOK_ID_NOT_FOUND: {
      statusCode: 400,
      customMessage: "Facebook Id Not Found",
      type: "FACEBOOK_ID_NOT_FOUND"
    },
    PHONE_VERIFICATION_COMPLETE: {
      statusCode: 400,
      customMessage: "Your mobile number verification is already completed.",
      type: "PHONE_VERIFICATION_COMPLETE"
    },
    EMAIL_VERIFICATION_COMPLETE: {
      statusCode: 400,
      customMessage: "Your email address verification is already completed.",
      type: "EMAIL_VERIFICATION_COMPLETE"
    },
    OTP_CODE_NOT_FOUND: {
      statusCode: 400,
      customMessage: "Otp code not found for this user",
      type: "OTP_CODE_NOT_FOUND"
    },
    NOT_FOUND: {
      statusCode: 400,
      customMessage: "User Not Found",
      type: "NOT_FOUND"
    },
    WRONG_PASSWORD: {
      statusCode: 400,
      customMessage: "Invalid old password",
      type: "WRONG_PASSWORD"
    },
    NOT_UPDATE: {
      statusCode: 409,
      customMessage: "New password must be different from old password",
      type: "NOT_UPDATE"
    },
    PASSWORD_CHANGE_REQUEST_INVALID: {
      statusCode: 400,
      type: "PASSWORD_CHANGE_REQUEST_INVALID",
      customMessage: "Invalid password change request."
    },
    USER_NOT_REGISTERED: {
      statusCode: 401,
      customMessage: "User is not registered with us",
      type: "USER_NOT_REGISTERED"
    },
    PHONE_VERIFICATION: {
      statusCode: 400,
      customMessage: "Your mobile number verification is incomplete.",
      type: " PHONE_VERIFICATION"
    },
    INCORRECT_ID: {
      statusCode: 401,
      customMessage: "Incorrect Phone Number",
      type: "INCORRECT_ID"
    },
    NOT_VERFIFIED: {
      statusCode: 401,
      customMessage: "User Not Verified",
      type: "NOT_VERFIFIED"
    },
    PASSWORD_CHANGE_REQUEST_EXPIRE: {
      statusCode: 400,
      customMessage: " Password change request time expired",
      type: "PASSWORD_CHANGE_REQUEST_EXPIRE"
    },
    INVALID_EMAIL_FORMAT: {
      statusCode: 400,
      customMessage: "Inavlid email format",
      type: "INVALID_EMAIL_FORMAT"
    }
  },
  SUCCESS: {
    DEFAULT: {
      statusCode: 200,
      customMessage: "Success",
      type: "DEFAULT"
    },
    CREATED: {
      statusCode: 201,
      customMessage: "Created Successfully",
      type: "CREATED"
    },
    VERIFY_COMPLETE: {
      statusCode: 200,
      customMessage: "OTP verification is completed.",
      type: "VERIFY_SENT"
    },
    VERIFY_SENT: {
      statusCode: 200,
      customMessage: "Your new OTP has been sent to your phone",
      type: "VERIFY_SENT"
    },
    LOGOUT: {
      statusCode: 200,
      customMessage: "Logged Out Successfully",
      type: "LOGOUT"
    },
    PASSWORD_RESET: {
      statusCode: 200,
      customMessage: "Password Reset Successfully",
      type: "PASSWORD_RESET"
    }
  }
};

var notificationMessages = {};

var TIME_UNITS = {
  MONTHS: "months",
  HOURS: "hours",
  MINUTES: "minutes",
  SECONDS: "seconds",
  WEEKS: "weeks",
  DAYS: "days"
};

const CUSTOM_ERROR_404 = function (msg) {
  return {
    statusCode: 404,
    customMessage: msg + " NOT FOUND",
    type: "PAGE_NOT_FOUND"
  };
};

const CUSTOM_ERROR = function (msg, statusCode) {
  return {
    statusCode: statusCode || 400,
    customMessage: msg
  };
};


export default {
  SOCIAL,
  TIME_UNITS,
  DATABASE,
  swaggerDefaultResponseMessages,
  STATUS_MSG,
  notificationMessages,
  CUSTOM_ERROR_404,
  CUSTOM_ERROR
}