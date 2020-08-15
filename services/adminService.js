import Models from '../models';

const updateAdmin = function (criteria, dataToSet, options, callback) {
  options.lean = true;
  options.new = true;
  Models.Admin.findOneAndUpdate(criteria, dataToSet, options, callback);
};
//Insert User in DB
const createAdmin = function (objToSave, callback) {
  new Models.Admin(objToSave).save(callback);
};
//Delete User in DB
const deleteAdmin = function (criteria, callback) {
  Models.Admin.findOneAndRemove(criteria, callback);
};

//Get Users from DB
const getAdmin = async (criteria, projection, options, callback) => {
  options.lean = true;
  Models.Admin.find(criteria, projection, options, callback)
};

const getAdminPromise = function (criteria, projection, options) {
  options.lean = true;
  return new Promise((resolve, reject) => {
    Models.Admin.find(criteria, projection, options, function (err, data) {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

export default {
  updateAdmin,
  createAdmin,
  deleteAdmin,
  getAdmin,
  getAdminPromise
};
