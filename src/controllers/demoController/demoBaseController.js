

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

var demoFunction = function (payloadData, callback) {
  return callback(null, payloadData);
};

var demoFunctionAuth = function (userData, payloadData, callback) {
  appLogger.debug(">>>>", userData, payloadData)
  return callback(null, payloadData);
};

module.exports = {
  demoFunction: demoFunction,
  demoFunctionAuth: demoFunctionAuth
};
