# Node.js User Onboarding application
A Node based module using Mongodb to onboard user's into a very basic application, secured using JWT authorization.

The Node.js app uses [Hapi Framework](https://hapijs.com) and [Hapi Swagger](https://github.com/glennjones/hapi-swagger)

PS : This is an ES6 translation of this [project](https://github.com/ChoudharyNavit22/User-Onboarding-Module)

# Contents

* [Manual Deployment](#manual-deployment)
* [Upload Image/Document Guidelines](UPLOAD_IMAGE_GUIDLINE.md)

# Project Dependencies

* MongoDB ([Install MongoDB](https://docs.mongodb.com/manual/administration/install-community/))

# <a id="manual-deployment"></a>Manual Deployment

## Setup Node.js

Inorder to setup NodeJS you need to fellow the current steps:

### Mac OS X

* Step1: Install Home brew

```
$ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

$ brew -v
```

* Step2: Install Node using Brew

```
$ brew install node

$ node -v

$ npm -v
```

### Linux Systems

* Step1: Install Node using apt-get

```
$ sudo apt-get install curl python-software-properties

$ curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -

$ sudo apt-get install nodejs

$ node -v

$ npm -v
```
## Setup Node User Onboarding Application

* Step1: Git clone the application

* Step2: Install node modules

```
$ npm i

or 

$ npm install
```

```
$ npm i -g @babel/core @babel/node @babel/cli
```

* Step3: Copy .env.example to .env

```
$ cp .env.example .env
```

* Step4a: Start the application

```
$ npm start
```
* Step4b: Start With Nodemon
```
$ npm run startWithNodemon
```

## Build

```
$ npm run build
```

## Starting the build
```
$ npm run deployment
```

The current version of your application would be running on **http://localhost:8000** or **http://IP_OF_SERVER:8000** (in case you are running on the server)
