"use strict";

/**
* Please use tokenLogger for logging in this file try to abstain from console
* levels of logging:
* - TRACE - ‘blue’
* - DEBUG - ‘cyan’
* - INFO - ‘green’
* - WARN - ‘yellow’
* - ERROR - ‘red’
* - FATAL - ‘magenta’
*/

import Services from "../services";
import Config from "../config";
var Jwt = require("jsonwebtoken");

/**
 * 
 * @param {String} userId 
 * @param {String} userType 
 * @param {String} deviceUUID 
 * @param {String} token 
 * @returns 
 */
var getTokenFromDB = async function (userId, userType, token) {
  var criteria = (() => {
    switch (userType) {
      case Config.APP_CONSTANTS.DATABASE.USER_ROLES.ADMIN:
      case Config.APP_CONSTANTS.DATABASE.USER_ROLES.SUPERADMIN:
        return { adminId: userId, accessToken: token };
      default: return { userId, accessToken: token }
    }
  })();
  let result = await Services.TokenService.getRecordUsingPromise(criteria, {}, {});
  if (result && result.length > 0) {
    result[0].type = userType;
    return result[0];
  } else {
    return Config.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_TOKEN;
  }
};

/**
 * 
 * @param {String} userId 
 * @param {String} userType 
 * @param {Object} tokenData 
 * @param {String} tokenData.accessToken
 * @param {String} tokenData.deviceType
 * @param {String} tokenData.deviceName
 * @param {String} tokenData.deviceUUID
 * @param {Function} callback 
 */
const setTokenInDB = function (userId, userType, tokenData, callback) {
  tokenLogger.info("login_type::::::::", userType);
  let objectToCreate, criteria;
  switch (userType) {
    case Config.APP_CONSTANTS.DATABASE.USER_ROLES.SUPERADMIN:
    case Config.APP_CONSTANTS.DATABASE.USER_ROLES.ADMIN: {
      objectToCreate = { adminId: userId, ...tokenData };
      criteria = { adminId: userId, deviceUUID: tokenData.deviceUUID };
      break;
    }
    default: {
      objectToCreate = { userId: userId, ...tokenData };
      criteria = { userId, deviceUUID: tokenData.deviceUUID };
    }
  }
  Services.TokenService.getRecord(criteria, {}, {}, (err, data) => {
    if (data.length === 0) {
      Services.TokenService.createRecord(objectToCreate, (err) => {
        if (err) callback(err);
        else {
          callback();
        }
      });
    } else {
      Services.TokenService.updateRecord(criteria, tokenData, (err) => {
        if (err) callback(err);
        else {
          callback();
        }
      });
    }
  });

};

/**
 * 
 * @param {Object} tokenData 
 * @param {String} tokenData.id User ID
 * @param {String} tokenData.type User Type 
 * @param {Object} deviceData 
 * @param {String} deviceData.deviceUUID 
 * @param {String} deviceData.deviceType
 * @param {String} deviceData.deviceName
 * @param {Function} callback 
 */
const setToken = function (tokenData, deviceData, callback) {
  if (!tokenData.id || !tokenData.type) {
    callback(Config.APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR);
  } else {
    const tokenToSend = Jwt.sign(tokenData, process.env.JWT_SECRET_KEY);
    setTokenInDB(tokenData.id, tokenData.type, { accessToken: tokenToSend, ...deviceData }, (
      err,
      data
    ) => {
      callback(err, { accessToken: tokenToSend });
    });
  }
};

var verifyToken = async function (token) {
  try {
    const decodedData = await Jwt.verify(token, process.env.JWT_SECRET_KEY);
    const result = await getTokenFromDB(
      decodedData.id,
      decodedData.type,
      token
    );
    if (result && result._id) return { userData: result };
    else throw result;
  } catch (err) {
    console.error(err);
    return err;
  }
};

var decodeToken = async function (token) {
  try {
    const decodedData = await Jwt.verify(token, process.env.JWT_SECRET_KEY);
    return { userData: decodedData, token: token };
  } catch (err) {
    return err;
  }
};

export default {
  decodeToken: decodeToken,
  verifyToken: verifyToken,
  setToken: setToken
};
