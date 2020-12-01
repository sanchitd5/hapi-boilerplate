import Service from '../../services';
import async from "async";
import UniversalFunctions from "../../utils/universalFunctions";

var TokenManager = require("../../lib/tokenManager");
const ERROR = UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR;
const Config = UniversalFunctions.CONFIG;

const adminLogin = (payload, callback) => {
  const emailId = payload.emailId;
  const password = payload.password;
  var userFound = false;
  var accessToken = null;
  var successLogin = false;
  async.series(
    [
      (cb) => {
        Service.AdminService.getRecord({ emailId: emailId }, {}, {}, (err, result) => {
          if (err) cb(err);
          else {
            userFound = (result && result[0]) || null;
            cb(null, result);
          }
        });
      },
      (cb) => {
        //validations
        if (!userFound)
          cb(ERROR.USER_NOT_FOUND);
        else {
          if (userFound && userFound.password != UniversalFunctions.CryptData(password)) {
            cb(ERROR.INCORRECT_PASSWORD);
          } else if (userFound.isBlocked == true) {
            cb(ERROR.ACCOUNT_BLOCKED);
          } else {
            successLogin = true;
            cb();
          }
        }
      },
      (cb) => {

        var criteria = {
          emailId: emailId
        };
        var projection = {
          password: 0
        };
        var option = {
          lean: true
        };
        Service.AdminService.getRecord(criteria, projection, option, function (
          err,
          result
        ) {
          if (err) {
            cb(err);
          } else {
            userFound = (result && result[0]) || null;
            cb();
          }
        });
      },
      (cb) => {

        if (successLogin) {
          var tokenData = {
            id: userFound._id,
            type:
              UniversalFunctions.CONFIG.APP_CONSTANTS.DATABASE.USER_ROLES.ADMIN
          };
          TokenManager.setToken(tokenData, function (err, output) {
            if (err) {
              cb(err);
            } else {
              if (output && output.accessToken) {
                accessToken = output && output.accessToken;
                cb();
              } else {
                cb(ERROR.IMP_ERROR);
              }
            }
          });
        } else {
          cb(ERROR.IMP_ERROR);
        }
      }
    ],
    (err, data) => {
      if (err) {
        return callback(err);
      } else {
        return callback(null, {
          accessToken: accessToken,
          adminDetails: userFound
        });
      }
    }
  );
};

const accessTokenLogin = function (userData, callback) {
  var appVersion;
  var userdata = {};
  var userFound = null;
  async.series(
    [
      function (cb) {
        var criteria = {
          _id: userData._id
        };
        Service.AdminService.getRecord(criteria, { password: 0 }, {}, function (
          err,
          data
        ) {
          if (err) cb(err);
          else {
            if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN);
            else {
              userFound = (data && data[0]) || null;
              cb();
            }
          }
        });
      },
      function (cb) {
        appVersion = {
          latestIOSVersion: 100,
          latestAndroidVersion: 100,
          criticalAndroidVersion: 100,
          criticalIOSVersion: 100
        };
        cb(null);
      }
    ],
    function (err, user) {
      if (!err)
        return callback(null, {
          accessToken: userdata.accessToken,
          adminDetails: UniversalFunctions.deleteUnnecessaryUserData(userFound),
          appVersion: appVersion
        });
      else callback(err);
    }
  );
};

const createAdmin = function (userData, payloadData, callback) {
  let newAdmin;
  let userFound = false;
  async.series(
    [
      function (cb) {
        var criteria = {
          _id: userData._id
        };
        Service.AdminService.getRecord(criteria, { password: 0 }, {}, function (err, data) {
          if (err) cb(err);
          else {
            if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN);
            else {
              userFound = (data && data[0]) || null;
              if (userFound.userType != Config.APP_CONSTANTS.DATABASE.USER_ROLES.SUPERADMIN) cb(ERROR.PRIVILEGE_MISMATCH);
              else cb();
            }
          }
        });
      },
      function (cb) {
        var criteria = {
          emailId: payloadData.emailId
        }
        Service.AdminService.getRecord(criteria, {}, {}, function (err, data) {
          if (err) cb(err)
          else {
            if (data.length > 0) cb(ERROR.USERNAME_EXIST)
            else cb()
          }
        })
      },
      function (cb) {
        payloadData.initialPassword = UniversalFunctions.generateRandomString();
        payloadData.password = UniversalFunctions.CryptData(payloadData.initialPassword);
        payloadData.userType = Config.APP_CONSTANTS.DATABASE.USER_ROLES.ADMIN;
        Service.AdminService.createAdmin(payloadData, function (err, data) {
          if (err) cb(err)
          else {
            newAdmin = data;
            cb()
          }
        })
      }
    ],
    function (err, result) {
      if (err) return callback(err);
      else return callback(null, { adminDetails: UniversalFunctions.deleteUnnecessaryUserData(newAdmin) });
    }
  );
};

const getAdmin = function (userData, callback) {
  let adminList = [];
  let userFound = false;
  async.series([
    function (cb) {
      var criteria = {
        _id: userData._id
      };
      Service.AdminService.getRecord(criteria, { password: 0 }, {}, function (err, data) {
        if (err) cb(err);
        else {
          if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN);
          else {
            userFound = (data && data[0]) || null;
            if (userFound.userType != Config.APP_CONSTANTS.DATABASE.USER_ROLES.SUPERADMIN) cb(ERROR.PRIVILEGE_MISMATCH);
            else cb();
          }
        }
      });
    },
    function (cb) {
      Service.AdminService.getRecord({
        userType: Config.APP_CONSTANTS.DATABASE.USER_ROLES.ADMIN
      }, { password: 0, __v: 0, createdAt: 0 }, {}, function (err, data) {
        if (err) cb(err)
        else {
          adminList = data;
          cb()
        }
      })
    }
  ], function (err, result) {
    if (err) callback(err)
    else callback(null, { data: adminList })
  })
}

var blockUnblockAdmin = function (userData, payloadData, callback) {
  async.series([
    function (cb) {
      var criteria = {
        _id: userData._id
      };
      Service.AdminService.getRecord(criteria, { password: 0 }, {}, function (err, data) {
        if (err) cb(err);
        else {
          if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN);
          else {
            userFound = (data && data[0]) || null;
            if (userFound.userType != Config.APP_CONSTANTS.DATABASE.USER_ROLES.SUPERADMIN) cb(ERROR.PRIVILEGE_MISMATCH);
            else cb();
          }
        }
      });
    },
    function (cb) {
      Service.AdminService.getRecord({ _id: payloadData.adminId }, {}, {}, function (err, data) {
        if (err) cb(err)
        else {
          if (data.length == 0) cb(ERROR.USER_NOT_FOUND)
          else cb()
        }
      })
    },
    function (cb) {
      var criteria = {
        _id: payloadData.adminId
      }
      var dataToUpdate = {
        $set: {
          isBlocked: payloadData.block
        }
      }
      Service.AdminService.updateRecord(criteria, dataToUpdate, {}, function (err, data) {
        if (err) cb(err)
        else cb()
      })
    }
  ], function (err, result) {
    if (err) callback(err)
    else callback(null)
  })
}

const createUser = function (userData, payloadData, callback) {
  let newUserData;
  let userFound = false;
  async.series([
    function (cb) {
      var criteria = {
        _id: userData._id
      };
      Service.AdminService.getRecord(criteria, { password: 0 }, {}, function (err, data) {
        if (err) cb(err);
        else {
          if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN);
          else {
            userFound = (data && data[0]) || null;
            cb()
          }
        }
      });
    },
    function (cb) {
      Service.UserService.getRecord({ emailId: payloadData.emailId }, {}, {}, function (err, data) {
        if (err) cb(err)
        else {
          if (data.length != 0) cb(ERROR.USER_ALREADY_REGISTERED)
          else cb()
        }
      })
    },
    function (cb) {
      payloadData.initialPassword = UniversalFunctions.generateRandomString();
      payloadData.password = UniversalFunctions.CryptData(payloadData.initialPassword);
      payloadData.emailVerified = true;
      Service.UserService.createRecord(payloadData, function (err, data) {
        if (err) cb(err)
        else {
          newUserData = data;
          cb()
        }
      })
    }
  ], function (err, result) {
    if (err) callback(err)
    else callback(null, { userData: UniversalFunctions.deleteUnnecessaryUserData(newUserData) })
  })
}

const getUser = (userData, callback) => {
  let userList = [];
  let userFound = false;
  async.series([
    function (cb) {
      var criteria = {
        _id: userData._id
      };
      Service.AdminService.getRecord(criteria, { password: 0 }, {}, function (err, data) {
        if (err) cb(err);
        else {
          if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN);
          else {
            userFound = (data && data[0]) || null;
            if (userFound.isBlocked == true) cb(ERROR.ACCOUNT_BLOCKED)
            else cb()
          }
        }
      });
    },
    function (cb) {
      var projection = {
        password: 0,
        accessToken: 0,
        OTPCode: 0,
        code: 0,
        codeUpdatedAt: 0,
        __v: 0,
        registrationDate: 0
      }
      Service.UserService.getRecord({}, projection, {}, function (err, data) {
        if (err) cb(err)
        else {
          userList = data;
          cb()
        }
      })
    }
  ], function (err, result) {
    if (err) callback(err)
    else callback(null, { data: userList })
  })
}

var blockUnblockUser = function (userData, payloadData, callback) {
  async.series([
    function (cb) {
      var criteria = {
        _id: userData._id
      };
      Service.AdminService.getRecord(criteria, { password: 0 }, {}, function (err, data) {
        if (err) cb(err);
        else {
          if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN);
          else {
            userFound = (data && data[0]) || null;
            if (userFound.isBlocked == true) cb(ERROR.ACCOUNT_BLOCKED)
            else cb()
          }
        }
      });
    },
    function (cb) {
      Service.UserService.getRecord({ _id: payloadData.userId }, {}, {}, function (err, data) {
        if (err) cb(err)
        else {
          if (data.length == 0) cb(ERROR.USER_NOT_FOUND)
          else cb()
        }
      })
    },
    function (cb) {
      var criteria = {
        _id: payloadData.userId
      }
      var dataToUpdate = {
        $set: {
          isBlocked: payloadData.block
        }
      }
      Service.UserService.updateRecord(criteria, dataToUpdate, {}, function (err, data) {
        if (err) cb(err)
        else cb()
      })
    }
  ], function (err, result) {
    if (err) callback(err)
    else callback(null)
  })
}

var changePassword = function (userData, payloadData, callbackRoute) {
  var oldPassword = UniversalFunctions.CryptData(payloadData.oldPassword);
  var newPassword = UniversalFunctions.CryptData(payloadData.newPassword);
  var customerData;
  async.series(
    [
      function (cb) {
        var query = {
          _id: userData._id
        };
        var options = { lean: true };
        Service.AdminService.getRecord(query, {}, options, function (err, data) {
          if (err) {
            cb(err);
          } else {
            if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN);
            else {
              customerData = (data && data[0]) || null;
              if (customerData.isBlocked) cb(ERROR.ACCOUNT_BLOCKED);
              else cb();
            }
          }
        });
      },
      function (callback) {
        var query = {
          _id: userData._id
        };
        var projection = {
          password: 1,
          firstLogin: 1
        };
        var options = { lean: true };
        Service.AdminService.getRecord(query, projection, options, function (
          err,
          data
        ) {
          if (err) {
            callback(err);
          } else {
            customerData = (data && data[0]) || null;
            if (customerData == null) {
              callback(ERROR.NOT_FOUND);
            } else {
              if (payloadData.skip == false) {
                if (
                  data[0].password == oldPassword &&
                  data[0].password != newPassword
                ) {
                  callback(null);
                } else if (data[0].password != oldPassword) {
                  callback(ERROR.WRONG_PASSWORD);
                } else if (data[0].password == newPassword) {
                  callback(ERROR.NOT_UPDATE);
                }
              }
              else callback(null)
            }
          }
        });
      },
      function (callback) {
        var dataToUpdate;
        if (payloadData.skip == true && customerData.firstLogin == false) {
          dataToUpdate = { $set: { firstLogin: true }, $unset: { initialPassword: 1 } };
        }
        else if (payloadData.skip == false && customerData.firstLogin == false) {
          dataToUpdate = { $set: { password: newPassword, firstLogin: true }, $unset: { initialPassword: 1 } };
        }
        else if (payloadData.skip == true && customerData.firstLogin == true) {
          dataToUpdate = {}
        }
        else {
          dataToUpdate = { $set: { password: newPassword } };
        }
        var condition = { _id: userData._id };
        Service.AdminService.updateRecord(condition, dataToUpdate, {}, function (
          err,
          user
        ) {
          if (err) {
            callback(err);
          } else {
            if (!user || user.length == 0) {
              callback(ERROR.NOT_FOUND);
            } else {
              callback(null);
            }
          }
        });
      }
    ],
    function (error, result) {
      if (error) {
        return callbackRoute(error);
      } else {
        return callbackRoute(null);
      }
    }
  );
}

var logoutAdmin = function (userData, callbackRoute) {
  async.series(
    [
      function (cb) {
        var criteria = {
          _id: userData._id
        };
        Service.AdminService.getRecord(criteria, {}, {}, function (err, data) {
          if (err) cb(err);
          else {
            if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN);
            else {
              cb();
            }
          }
        });
      },
      function (callback) {
        var condition = { _id: userData._id };
        var dataToUpdate = { $unset: { accessToken: 1 } };
        Service.AdminService.updateRecord(condition, dataToUpdate, {}, function (
          err,
          result
        ) {
          if (err) {
            callback(err);
          } else {
            callback();
          }
        });
      }
    ],
    function (error, result) {
      if (error) {
        return callbackRoute(error);
      } else {
        return callbackRoute(null);
      }
    }
  );
}

export default {
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
};