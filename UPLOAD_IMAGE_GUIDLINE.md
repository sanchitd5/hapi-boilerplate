# Guidlines to Setup Uploading Image/Document

This is a guidline how to setup your system to upload images to IBM COS(Cloud Object Storage) for your project.

You can get a detailed understanding on the npm [ibm-cos-sdk](https://www.npmjs.com/package/ibm-cos-sdk).

# Contents

* [Install GraphicsMagick](#grapicsmagick)
* [Install ImageMagick](#imagemagick)
* [Install FFmpeg](#ffmpeg)
* [Setup auto folder structure for upload](#auto_folder)
* [Setup manual folder structure for upload](#manual_folder)

# Steps to Setup Upload Images/Documents

## Setup GraphicsMagick & ImageMagick

GraphicsMagick and ImageMagick are two libraries that are being used by the project inorder to make thumbnails of the image that you are uploading. You can get a detailed understanding of them here:

* [GraphicksMagick](http://www.graphicsmagick.org/)
* [ImageMagick](https://imagemagick.org/index.php)

### <a id="grapicsmagick"></a>Instal GraphicsMagick

* Install for Mac OS X

```
$ brew update

$ brew install graphicsmagick

```

* Install for Ubuntu

```
$ sudo apt-get update

$ sudo apt-get install graphicsmagick

```

### <a id="imagemagick"></a>Instal ImageMagick

* Install for Mac OS X

```
$ brew update

$ brew install imagemagick

```

* Install for Ubuntu

```
$ sudo apt-get update

$ sudo apt-get install imagemagick

```

### <a id="ffmpeg"></a>Instal FFmpeg

Preffer installing version 3.* as version 4.* currently gives issues.

* Install for Mac OS X

```
$ brew update

$ brew install ffmpeg

```

* Install for Ubuntu

```
$ sudo apt-get update

$ sudo apt-get install ffmpeg

```

## <a id="auto_folder"></a>Setup folder structure for the project

To setup the folder structure for the project you need to run the **setup_upload.sh** file in the project directory.

The file need an input from user that is **PROJECT_FOLDER** this should be the same as the **"projectFolder" in awsS3Config.js** file in config folder.

After setting it up run the command:

```
$ PROJECT_FOLDER=<Project Folder Name> bash setup_upload.sh 
```

## <a id="manual_folder"></a>Setup folder structure manually

If you want to setup the folder structure for the upload mechanism on your own you can make the structure according to the provided tree. Keep in mind the **PROJECT_FOLDER** name is same with **awsS3Config.js in config folder**.

* Step 1: Go to the parent folder of your system where you have currently deployed the project

```
$ cd ..

```

* Step 2: Create this folder structure

```
+-- _uploads
|   +-- _PROJECT_FOLDER
|       +-- _profilePicture
|           +-- thumb
|       +-- docs

```

## Important Point

Remember to update the same folder name in config/awsS3Config.js of your project.