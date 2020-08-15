/*
*Please add project folder name and ibm bucket name here,
* make sure project folder name doesnt not have spaces in between and is same
* as the name you give while running upload_setup.sh
*/
var s3BucketCredentials = {
    "projectFolder": "<project_folder_name>",
    "bucket": "<project_bucket_ibm>",
    "endpoint": 's3.au-syd.cloud-object-storage.appdomain.cloud',
    "apiKeyId": 'mhNbtjQUlsq2LBh5F03g81g1Wcq8hN6H1ZrWnpRtcD3L',
    "serviceInstanceId": "crn:v1:bluemix:public:cloud-object-storage:global:a/200d885c6c6a4629814c74e3c7594d35:bb53fed0-c301-4705-ad41-27a08a0ae3a6:bucket:ipan-v2-bucket",
    "folder": {
        "profilePicture": "profilePicture",
        "thumb": "thumb",
        "original": "original",
        "image": "image",
        "docs": "docs",
        "files": "files",
        "video": "video",
        "audio": "audio"
    }
};
export default {
    s3BucketCredentials: s3BucketCredentials
};
