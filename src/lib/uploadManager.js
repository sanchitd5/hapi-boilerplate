/**
* Please use uploadLogger for logging in this file try to abstain from console
* levels of logging:
* - TRACE - ‘blue’
* - DEBUG - ‘cyan’
* - INFO - ‘green’
* - WARN - ‘yellow’
* - ERROR - ‘red’
* - FATAL - ‘magenta’
*/

var CONFIG = require('../config');
var UniversalFunctions = require('../utils/universalFunctions');
var async = require('async');
var Path = require('path');
var knox = require('knox');
var fsExtra = require('fs-extra');
var fs = require('fs');
var AWS = require('ibm-cos-sdk');
var ffmpeg = require("fluent-ffmpeg");
///*
// 1) Save Local Files
// 2) Create Thumbnails
// 3) Upload Files to S3
// 4) Delete Local files
// */
//

var deleteFile = function deleteFile(path, callback) {

    fs.unlink(path, function (err) {
        uploadLogger.error("delete", err);
        if (err) {
            var error = {
                response: {
                    message: "Something went wrong",
                    data: {}
                },
                statusCode: 500
            };
            return callback(error);
        } else
            return callback(null);
    });

}
var uploadImageToS3Bucket = function uploadImageToS3Bucket(file, isThumb, callback) {

    var path = file.path, filename = file.name, folder = file.s3Folder, mimeType = file.mimeType;
    if (isThumb) {
        path = path + 'thumb/';
        filename = file.thumbName;
        folder = file.s3FolderThumb;
    }
    //<------ Start of Configuration for ibm bucket -------------->
    var ibms3Config = {
        endpoint: CONFIG.AWS_S3_CONFIG.s3BucketCredentials.endpoint,
        apiKeyId: CONFIG.AWS_S3_CONFIG.s3BucketCredentials.apiKeyId,
        serviceInstanceId: CONFIG.AWS_S3_CONFIG.s3BucketCredentials.serviceInstanceId
    };
    //<------ End of Configuration for ibm bucket -------------->
    uploadLogger.info("path to read::" + path + filename);
    fs.readFile(path + filename, function (error, fileBuffer) {
        uploadLogger.info("path to read from temp::" + path + filename);
        if (error) {
            uploadLogger.error("UPLOAD", error, fileBuffer);
            var errResp = {
                response: {
                    message: "Something went wrong",
                    data: {}
                },
                statusCode: 500
            };
            return callback(errResp);
        }

        var s3bucket = new AWS.S3(ibms3Config);
        var params = {
            Bucket: CONFIG.AWS_S3_CONFIG.s3BucketCredentials.bucket,
            Key: folder + '/' + filename,
            Body: fileBuffer,
            ACL: 'public-read',
            ContentType: mimeType
        };

        s3bucket.putObject(params, function (err, data) {
            if (err) {
                var error = {
                    response: {
                        message: "Something went wrong",
                        data: {}
                    },
                    statusCode: 500
                };
                return callback(error);
            }
            else {
                deleteFile(path + filename, function (err) {
                    uploadLogger.error(err);
                    if (err)
                        return callback(err);
                    else
                        return callback(null);
                })
            }
        });
    });
};

function initParallelUpload(fileObj, withThumb, callbackParent) {
    async.parallel([
        function (callback) {
            uploadLogger.info("uploading image");
            uploadImageToS3Bucket(fileObj, false, callback);
        },
        function (callback) {
            if (withThumb) {
                uploadLogger.info("uploading thumbnil");
                uploadImageToS3Bucket(fileObj, true, callback);
            }
            else
                callback(null);
        }
    ], function (error) {
        if (error)
            callbackParent(error);
        else
            callbackParent(null);
    })

}
var saveFile = function saveFile(fileData, path, callback) {

    var file = fs.createWriteStream(path);
    uploadLogger.info("=========save file======");
    file.on('error', function (err) {

        uploadLogger.error('@@@@@@@@@@@@@', err);
        var error = {
            response: {
                message: "Some",
                data: {}
            },
            statusCode: 500
        };
        return callback(error);
    });

    fileData.pipe(file);

    fileData.on('end', function (err) {
        if (err) {
            var error = {
                response: {
                    message: "Some",
                    data: {}
                },
                statusCode: 500
            };
            return callback(error);
        } else
            callback(null);
    });


};
var createThumbnailImage = function createThumbnailImage(path, name, callback) {
    uploadLogger.info('------first-----');
    var gm = require('gm').subClass({ imageMagick: true });
    var thumbPath = path + 'thumb/' + "Thumb_" + name;
    //var tmp_path = path + "-tmpPath"; //will be put into a temp directory

    gm(path + name)
        .resize(160, 160, "!")
        .autoOrient()
        .write(thumbPath, function (err) {
            uploadLogger.info('createThumbnailImage');
            if (!err) {
                return callback(null);
            } else {
                var error = {
                    response: {
                        message: "Something went wrong",
                        data: {}
                    },
                    statusCode: 500
                };
                uploadLogger.info('<<<<<<<<<<<<<<<<<', error);
                return callback(error);
            }
        })
};

var getVideoInfo = function (filePath, callback) {
    ffmpeg.ffprobe(filePath, function (err, data) {
        if (err) callback(err)
        else callback(null, data)
    })
}

var createThumbnailVideo = function (filePath, name, videoData, callback) {
    uploadLogger.info('------first-----');
    var thumbPath = filePath + 'thumb/' + 'Thumb_' + name.split('.').slice(0, -1).join('.') + '.jpg';
    var durationInSeconds = videoData.format.duration;
    var frameIntervalInSeconds = Math.floor(durationInSeconds);
    ffmpeg().input(filePath + name).outputOptions([`-vf fps=1/${frameIntervalInSeconds}`]).output(thumbPath).on('end', function () {
        callback()
    }).on('error', function (err) {
        callback(err)
    }).run()
};

function uploadFile(otherConstants, fileDetails, createThumbnail, callbackParent) {
    var filename = fileDetails.name;
    var TEMP_FOLDER = otherConstants.TEMP_FOLDER;
    var s3Folder = otherConstants.s3Folder;
    var file = fileDetails.file;
    var mimiType = file.hapi.headers['content-type'];
    async.waterfall([
        function (callback) {
            uploadLogger.info('TEMP_FOLDER + filename' + TEMP_FOLDER + filename)
            saveFile(file, TEMP_FOLDER + filename, callback);
            uploadLogger.info("*******save File******")
        },
        function (callback) {
            if (createThumbnail) {
                createThumbnailImage(TEMP_FOLDER, filename, callback);
                uploadLogger.info("*******thumbnailImage********")
            }

            else
                callback(null);
        },
        function (callback) {
            var fileObj = {
                path: TEMP_FOLDER,
                name: filename,
                thumbName: "Thumb_" + filename,
                mimeType: mimiType,
                s3Folder: s3Folder
            };
            if (createThumbnail)
                fileObj.s3FolderThumb = otherConstants.s3FolderThumb;
            initParallelUpload(fileObj, createThumbnail, callback);
        }
    ], function (error) {
        if (error)
            callbackParent(error);
        else
            callbackParent(null);
    })
};


function uploadVideoFile(otherConstants, fileDetails, createThumbnail, callbackParent) {
    var filename = fileDetails.name;
    var TEMP_FOLDER = otherConstants.TEMP_FOLDER;
    var s3Folder = otherConstants.s3Folder;
    var file = fileDetails.file;
    var mimiType = file.hapi.headers['content-type'];
    var videoData;
    async.waterfall([
        function (callback) {
            uploadLogger.info('TEMP_FOLDER + filename' + TEMP_FOLDER + filename)
            saveFile(file, TEMP_FOLDER + filename, callback);
            uploadLogger.info("*******save File******", callback)
        },
        function (callback) {
            getVideoInfo(TEMP_FOLDER + filename, function (err, data) {
                if (err) callback(err)
                else {
                    videoData = data;
                    callback()
                }
            })
        },
        function (callback) {
            if (createThumbnail) {
                createThumbnailVideo(TEMP_FOLDER, filename, videoData, callback);
            }

            else
                callback(null);
        },
        function (callback) {
            var fileObj = {
                path: TEMP_FOLDER,
                name: filename,
                thumbName: "Thumb_" + filename.split('.').slice(0, -1).join('.') + '.jpg',
                mimeType: mimiType,
                s3Folder: s3Folder
            };
            if (createThumbnail)
                fileObj.s3FolderThumb = otherConstants.s3FolderThumb;
            initParallelUpload(fileObj, createThumbnail, callback);
        }
    ], function (error) {
        if (error)
            callbackParent(error);
        else
            callbackParent(null, { videoData: videoData });
    })
};


function uploadProfilePicture(profilePicture, folder, filename, callbackParent) {
    var baseFolder = folder + '/' + CONFIG.AWS_S3_CONFIG.s3BucketCredentials.folder.profilePicture;
    var baseURL = "https://" + CONFIG.AWS_S3_CONFIG.s3BucketCredentials.endpoint + '/' + CONFIG.AWS_S3_CONFIG.s3BucketCredentials.bucket + '/' + baseFolder + '/';
    var urls = {};
    async.waterfall([
        function (callback) {
            var profileFolder = CONFIG.AWS_S3_CONFIG.s3BucketCredentials.folder.original;
            var profileFolderThumb = CONFIG.AWS_S3_CONFIG.s3BucketCredentials.folder.thumb;
            var profilePictureName = UniversalFunctions.generateFilenameWithExtension(profilePicture.hapi.filename, "Profile_" + filename);
            var s3Folder = baseFolder + '/' + profileFolder;
            var s3FolderThumb = baseFolder + '/' + profileFolderThumb;
            var profileFolderUploadPath = CONFIG.AWS_S3_CONFIG.s3BucketCredentials.projectFolder + "/profilePicture";
            var path = Path.resolve("..") + "/uploads/" + profileFolderUploadPath + "/";
            var fileDetails = {
                file: profilePicture,
                name: profilePictureName
            };
            var otherConstants = {
                TEMP_FOLDER: path,
                s3Folder: s3Folder,
                s3FolderThumb: s3FolderThumb
            };
            urls.profilePicture = baseURL + profileFolder + '/' + profilePictureName;
            urls.profilePictureThumb = baseURL + profileFolderThumb + '/Thumb_' + profilePictureName;
            uploadFile(otherConstants, fileDetails, true, callback);
        }
    ],

        function (error) {
            if (error) {
                uploadLogger.error("upload image error :: ", error);
                callbackParent(error);
            }
            else {
                uploadLogger.info("upload image result :", urls);
                callbackParent(null, urls);
            }
        })
}

function uploadfileWithoutThumbnail(docFile, folder, filename, callbackParent) {
    var baseFolder = folder + '/' + CONFIG.AWS_S3_CONFIG.s3BucketCredentials.folder.docs;
    var baseURL = "https://" + CONFIG.AWS_S3_CONFIG.s3BucketCredentials.endpoint + '/' + CONFIG.AWS_S3_CONFIG.s3BucketCredentials.bucket + '/' + baseFolder + '/';
    var urls = {};
    async.waterfall([
        function (callback) {
            var docFileFolder = CONFIG.AWS_S3_CONFIG.s3BucketCredentials.folder.original;
            //var profileFolderThumb =CONFIG.awsS3Config.s3BucketCredentials.folder.thumb;
            var docFileName = UniversalFunctions.generateFilenameWithExtension(docFile.hapi.filename, "Docs_" + filename);
            var s3Folder = baseFolder + '/' + docFileFolder;
            //var s3FolderThumb = baseFolder + '/' + profileFolderThumb;
            var docFolderUploadPath = CONFIG.AWS_S3_CONFIG.s3BucketCredentials.projectFolder + "/docs";
            var path = Path.resolve("..") + "/uploads/" + docFolderUploadPath + "/";
            var fileDetails = {
                file: docFile,
                name: docFileName
            };
            var otherConstants = {
                TEMP_FOLDER: path,
                s3Folder: s3Folder
                //s3FolderThumb: s3FolderThumb
            };
            urls.docFile = baseURL + docFileFolder + '/' + docFileName;
            //urls.profilePictureThumb = baseURL + profileFolderThumb + '/Thumb_' + profilePictureName;
            uploadFile(otherConstants, fileDetails, false, callback);
        }
    ],

        function (error) {
            if (error) {
                uploadLogger.error("upload image error :: ", error);
                callbackParent(error);
            }
            else {
                uploadLogger.info("upload image result :", urls);
                callbackParent(null, urls);
            }
        })
}

function uploadVideoWithThumbnail(videoFile, folder, filename, callbackParent) {
    var baseFolder = folder + '/' + CONFIG.AWS_S3_CONFIG.s3BucketCredentials.folder.video;
    var baseURL = "https://" + CONFIG.AWS_S3_CONFIG.s3BucketCredentials.endpoint + '/' + CONFIG.AWS_S3_CONFIG.s3BucketCredentials.bucket + '/' + baseFolder + '/';
    var urls = {};
    var fileDetails, otherConstants;
    async.waterfall([
        function (callback) {
            var videoFileFolder = CONFIG.AWS_S3_CONFIG.s3BucketCredentials.folder.original;
            var videoFolderThumb = CONFIG.AWS_S3_CONFIG.s3BucketCredentials.folder.thumb;
            var videoFileName = UniversalFunctions.generateFilenameWithExtension(videoFile.hapi.filename, "Video_" + filename);
            var s3Folder = baseFolder + '/' + videoFileFolder;
            var s3FolderThumb = baseFolder + '/' + videoFolderThumb;
            var videoFolderUploadPath = CONFIG.AWS_S3_CONFIG.s3BucketCredentials.projectFolder + "/video";
            var path = Path.resolve("..") + "/uploads/" + videoFolderUploadPath + "/";
            fileDetails = {
                file: videoFile,
                name: videoFileName
            };
            otherConstants = {
                TEMP_FOLDER: path,
                s3Folder: s3Folder,
                s3FolderThumb: s3FolderThumb
            };
            urls.videoFile = baseURL + videoFileFolder + '/' + videoFileName;
            urls.videoFileThumb = baseURL + videoFolderThumb + '/Thumb_' + videoFileName.split('.').slice(0, -1).join('.') + '.jpg';
            uploadVideoFile(otherConstants, fileDetails, true, function (err, data) {
                if (err) callback(err)
                else {
                    urls.videoInfo = data.videoData;
                    callback()
                }
            });
        }
    ],

        function (error) {
            if (error) {
                uploadLogger.error("upload image error :: ", error);
                callbackParent(error);
            }
            else {
                uploadLogger.info("upload image result :", urls);
                callbackParent(null, urls);
            }
        })
}

function saveCSVFile(fileData, path, callback) {
    fsExtra.copy(fileData, path, callback);
}

module.exports = {
    uploadProfilePicture: uploadProfilePicture,
    saveCSVFile: saveCSVFile,
    uploadfileWithoutThumbnail: uploadfileWithoutThumbnail,
    uploadVideoWithThumbnail: uploadVideoWithThumbnail
};