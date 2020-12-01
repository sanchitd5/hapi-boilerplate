import Models from '../models';

const getForgetPasswordRequest = function (conditions, projection, options, callback) {
    Models.ForgetPassword.find(conditions, projection, options, callback);
};
const updateForgetPasswordRequest = function (criteria, dataToSet, options, callback) {
    Models.ForgetPassword.findOneAndUpdate(criteria, dataToSet, options, callback);
};

const createForgetPasswordRequest = function (data, callback) {
    var forgotPasswordEntry = new Models.ForgetPassword(data);
    forgotPasswordEntry.save(function (err, result) {
        callback(err, result);
    })
}

export default {
    getForgetPasswordRequest,
    updateForgetPasswordRequest,
    createForgetPasswordRequest
}