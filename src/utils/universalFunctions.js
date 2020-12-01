

/**
* Please use appLogger for logging in this file try to abstain from console
* levels of logging:
* - TRACE - ‘blue’
* - DEBUG - ‘cyan’
* - INFO - ‘green’
* - WARN - ‘yellow’
* - ERROR - ‘red’
* - FATAL - ‘magenta’
*/
import Joi from "joi";
import MD5 from "md5";
import Boom from "@hapi/boom";
import CONFIG from "../config";
import randomstring from "randomstring";
import validator from "validator";
import moment from "moment";


const sendError = (data) => {
  console.trace('ERROR OCCURED ', data)
  if (typeof data == 'object' && data.hasOwnProperty('statusCode') && data.hasOwnProperty('customMessage')) {
    appLogger.info('attaching resposnetype', data.type)
    let errorToSend = new Boom.Boom(data.customMessage, { statusCode: data.statusCode });
    errorToSend.output.payload.responseType = data.type;
    return errorToSend;
  } else {
    let errorToSend = '';
    if (typeof data == 'object') {
      if (data.name == 'MongoError') {
        errorToSend += CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.DB_ERROR.customMessage;
        if (data.code = 11000) {
          let duplicateValue = data.errmsg && data.errmsg.substr(data.errmsg.lastIndexOf('{ : "') + 5);
          duplicateValue = duplicateValue.replace('}', '');
          errorToSend += CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.DUPLICATE.customMessage + " : " + duplicateValue;
          if (data.message.indexOf('customer_1_streetAddress_1_city_1_state_1_country_1_zip_1') > -1) {
            errorToSend = CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.DUPLICATE_ADDRESS.customMessage;
          }
        }
      } else if (data.name == 'ApplicationError') {
        errorToSend += CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.APP_ERROR.customMessage + ' : ';
      } else if (data.name == 'ValidationError') {
        errorToSend += CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.APP_ERROR.customMessage + data.message;
      } else if (data.name == 'CastError') {
        errorToSend += CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.DB_ERROR.customMessage + CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_ID.customMessage + data.value;
      }
    } else {
      errorToSend = data
    }
    var customErrorMessage = errorToSend;
    if (typeof customErrorMessage == 'string') {
      if (errorToSend.indexOf("[") > -1) {
        customErrorMessage = errorToSend.substr(errorToSend.indexOf("["));
      }
      customErrorMessage = customErrorMessage && customErrorMessage.replace(/"/g, '');
      customErrorMessage = customErrorMessage && customErrorMessage.replace('[', '');
      customErrorMessage = customErrorMessage && customErrorMessage.replace(']', '');
    }
    return new Boom.Boom(customErrorMessage, { statusCode: 400 })
  }
};

const sendSuccess = (successMsg, data) => {
  successMsg = successMsg || CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT.customMessage;
  if (typeof successMsg == 'object' && successMsg.hasOwnProperty('statusCode') && successMsg.hasOwnProperty('customMessage')) {
    return { statusCode: successMsg.statusCode, message: successMsg.customMessage, data: data || {} };

  } else {
    return { statusCode: 200, message: successMsg, data: data || {} };

  }
};
const failActionFunction = (request, reply, error) => {
  var customErrorMessage = '';
  if (error.output.payload.message.indexOf("[") > -1) {
    customErrorMessage = error.output.payload.message.substr(error.output.payload.message.indexOf("["));
  } else {
    customErrorMessage = error.output.payload.message;
  }
  customErrorMessage = customErrorMessage.replace(/"/g, '');
  customErrorMessage = customErrorMessage.replace('[', '');
  customErrorMessage = customErrorMessage.replace(']', '');
  error.output.payload.message = customErrorMessage;
  delete error.output.payload.validation
  return error;
};

const authorizationHeaderObj = Joi.object({
  authorization: Joi.string().required()
}).options({ allowUnknown: true });

const generateRandomString = (stringLength) => {
  if (stringLength === undefined) stringLength = 12;
  return randomstring.generate(stringLength);
};

const generateRandomNumber = () => {
  var num = Math.floor(Math.random() * 90000) + 10000;
  return num;
};

const generateRandomAlphabet = function (len) {
  var charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  var randomString = '';
  for (var i = 0; i < len; i++) {
    var randomPoz = Math.floor(Math.random() * charSet.length);
    randomString += charSet.substring(randomPoz, randomPoz + 1);
    randomString = randomString.toUpperCase();
  }
  return randomString;
}

const CryptData = (stringToCrypt) => {
  return MD5(MD5(stringToCrypt));
};

const validateLatLongValues = (lat, long) => {
  var valid = true;
  if (lat < -90 || lat > 90) {
    valid = false;
  }
  if (long < -180 || long > 180) {
    valid = false;
  }
  return valid;
};

const validateString = (str, pattern) => {
  appLogger.info(str, pattern, str.match(pattern));
  return str.match(pattern);
};

const verifyEmailFormat = (string) => {
  return validator.isEmail(string)
};
var deleteUnnecessaryUserData = function (userObj) {
  appLogger.info('deleting>>', userObj)
  delete userObj.__v;
  delete userObj.password;
  delete userObj.registrationDate;
  delete userObj.OTPCode;
  appLogger.info('deleted', userObj)
  return userObj;
};
var generateFilenameWithExtension = function generateFilenameWithExtension(oldFilename, newFilename) {
  var ext = oldFilename.substr((~-oldFilename.lastIndexOf(".") >>> 0) + 2);
  return newFilename + '.' + ext;
}


function isEmpty(obj) {
  // null and undefined are "empty"
  if (obj == null) return true;

  // Assume if it has a length property with a non-zero value
  // that that property is correct.
  if (obj.length && obj.length > 0) return false;
  if (obj.length === 0) return true;

  // Otherwise, does it have any properties of its own?
  // Note that this doesn't handle
  // toString and toValue enumeration bugs in IE < 9
  for (var key in obj) {
    if (hasOwnProperty.call(obj, key)) return false;
  }

  return true;
}

var getTimestamp = function (inDate) {
  if (inDate)
    return new Date();

  return new Date().toISOString();
};

var createArray = function (List, keyName) {
  appLogger.info("create array------>>>>>>>")
  var IdArray = [];
  var keyName = keyName;
  for (var key in List) {
    if (List.hasOwnProperty(key)) {
      //logger.debug(data[key][keyName]);
      IdArray.push((List[key][keyName]).toString());
    }
  }
  return IdArray;

};
function getRange(startDate, endDate, diffIn) {

  var dr = moment.range(startDate, endDate);

  if (!diffIn)
    diffIn = CONFIG.APP_CONSTANTS.TIME_UNITS.HOURS;
  if (diffIn == "milli")
    return dr.diff();

  return dr.diff(diffIn);

}

var checkFileExtension = function (fileName) {
  return fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length) || fileName;
}

/**
 * @author Sanchit Dang
 * 
 * @param {Object} obj Object to clean.
 * @param {Function} callback callback function which returns cleaned object.
 * @returns {Object} Cleaned Version of the object. 
 */
const cleanObject = (obj, callback) => {
  let newObj = Object.keys(obj)
    .filter(k => obj[k] != undefined && obj[k] != null && obj[k] != '') // Remove undef. and null.
    .reduce(
      (newObj, k) =>
        typeof obj[k] === "object"
          ? { ...newObj, [k]: cleanObject(obj[k]) } // Recurse.
          : { ...newObj, [k]: obj[k] }, // Copy value.
      {}
    );
  if (callback instanceof Function)
    callback(newObj);
  return newObj;
}

const universalFunctions = {
  generateRandomString,
  CryptData,
  CONFIG,
  sendError,
  sendSuccess,
  failActionFunction,
  authorizationHeaderObj,
  validateLatLongValues,
  validateString,
  verifyEmailFormat,
  deleteUnnecessaryUserData,
  generateFilenameWithExtension,
  isEmpty,
  getTimestamp,
  generateRandomNumber,
  createArray,
  generateRandomAlphabet,
  getRange,
  checkFileExtension,
  cleanObject
};

export default universalFunctions;
