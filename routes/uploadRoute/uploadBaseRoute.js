


import UniversalFunctions from "../../utils/universalFunctions";
import Joi from "joi";
import Controller from "../../controllers";

const uploadImage =
{
  method: 'POST',
  path: '/api/upload/uploadImage',
  handler: function (request, reply) {
    var payloadData = request.payload;
    return new Promise((resolve, reject) => {
      Controller.UploadBaseController.uploadImage(payloadData, function (err, data) {
        if (err) {
          reject(UniversalFunctions.sendError(err));
        } else {
          resolve(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data))
        }
      });
    });
  },
  options: {
    description: 'image upload',
    tags: ['api', 'upload', 'image'],
    payload: {
      maxBytes: 20715200,
      output: 'stream',
      parse: true,
      allow: 'multipart/form-data'
    },
    validate: {
      payload: Joi.object({
        imageFile: Joi.any()
          .meta({ swaggerType: 'file' })
          .required()
          .description('image file')
      }).label("Upload: Image"),
      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      'hapi-swagger': {
        responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
}


const uploadVideo =
{
  method: 'POST',
  path: '/api/upload/uploadVideo',
  handler: function (request, reply) {
    var payloadData = request.payload;
    return new Promise((resolve, reject) => {
      Controller.UploadBaseController.uploadVideo(payloadData, function (err, data) {
        if (err) {
          reject(UniversalFunctions.sendError(err));
        } else {
          resolve(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data))
        }
      });
    });
  },
  options: {
    description: 'video upload',
    tags: ['api', 'upload', 'video'],
    payload: {
      maxBytes: 207152000,
      output: 'stream',
      parse: true,
      allow: 'multipart/form-data'
    },
    validate: {
      payload: Joi.object({
        videoFile: Joi.any()
          .meta({ swaggerType: 'file' })
          .required()
          .description('video file')
      }).label("Upload: Video"),
      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      'hapi-swagger': {
        responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
}


const uploadDocument =
{
  method: 'POST',
  path: '/api/upload/uploadDocument',
  handler: function (request, reply) {
    var payloadData = request.payload;
    return new Promise((resolve, reject) => {
      Controller.UploadBaseController.uploadDocument(payloadData, function (err, data) {
        if (err) {
          reject(UniversalFunctions.sendError(err));
        } else {
          resolve(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data))
        }
      });
    });
  },
  options: {
    description: 'upload document',
    tags: ['api', 'upload', 'document'],
    payload: {
      maxBytes: 20715200,
      output: 'stream',
      parse: true,
      allow: 'multipart/form-data'
    },
    validate: {
      payload: Joi.object({
        documentFile: Joi.any()
          .meta({ swaggerType: 'file' })
          .required()
          .description('document file')
      }).label("Upload: Document"),
      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      'hapi-swagger': {
        responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};

export default [
  uploadImage, uploadDocument, uploadVideo
];
