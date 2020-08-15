import Hapi from "@hapi/hapi";
import Joi from "@hapi/joi";
import log4js from "log4js";
import SwaggerPlugins from "../plugins";
import * as handlebars from "handlebars";
import mongoose from "mongoose";
import CONFIG from "../config/index";
import Path from "path";

/**
 * @description Helper file for the server
 */
class ServerHelper {

  setGlobalAppRoot() {
    global.appRoot = Path.resolve(__dirname)
  }


  bootstrap() {

  }

  /**
   * @returns {Server} A Hapi Server
   */
  createServer() {
    let server = new Hapi.Server({
      app: {
        name: process.env.APP_NAME || "default"
      },
      port: process.env.HAPI_PORT || 8000,
      routes: { cors: true }
    });
    server.validator(Joi);
    return server;
  }

  /**
   * @author Sanchit Dang
   * @description Adds Views to the server
   * @param {Server} server 
   */
  addViews(server) {
    server.views({
      engines: {
        html: handlebars
      },
      relativeTo: __dirname,
      path: "../views"
    });
  }

  /**
   * @author Sanchit Dang
   * @description sets default route for the server
   * @param {Server} server HAPI Server
   * @param {String} defaultRoute Optional - default route
   */
  setDefaultRoute(server, defaultRoute) {
    if (defaultRoute === undefined) defaultRoute = "/"
    server.route({
      method: "GET",
      path: defaultRoute,
      handler: (req, res) => {
        return res.view("welcome");
      }
    });
  }

  /**
   * 
   * @param {Server} server HAPI Server
   */
  async registerPlugins(server) {
    await server.register(SwaggerPlugins, {}, err => {
      if (err)
        server.log(["error"], "Error while loading plugins : " + err);
      else
        server.log(["info"], "Plugins Loaded");
    });
  }

  configureLog4js = () => {
    // Configuration for log4js.
    log4js.configure({
      appenders: {
        App: { type: 'console' },
        Upload_Manager: { type: 'console' },
        Socket_Manager: { type: 'console' },
        Token_Manager: { type: 'console' },
        Mongo_Manager: { type: 'console' }
      },
      categories: {
        default: { appenders: ['App'], level: 'trace' },
        Upload_Manager: { appenders: ['Upload_Manager'], level: 'trace' },
        Socket_Manager: { appenders: ['Socket_Manager'], level: 'trace' },
        Token_Manager: { appenders: ['Token_Manager'], level: 'trace' },
        Mongo_Manager: { appenders: ['Mongo_Manager'], level: 'trace' }
      }
    });
    // Global Logger variables for logging
    global.appLogger = log4js.getLogger('App');
    global.uploadLogger = log4js.getLogger('Upload_Manager');
    global.socketLogger = log4js.getLogger('Socket_Manager');
    global.tokenLogger = log4js.getLogger('Token_Manager');
    global.mongoLogger = log4js.getLogger('Mongo_Manager');
  }

  async startServer(server) {
    try {
      await server.start();
      appLogger.info("Server running on %s", server.info.uri);
    } catch (error) {
      appLogger.fatal(error);
    }
  }

  connectMongoDB() {

    mongoose.connect(CONFIG.DB_CONFIG.mongo.URI, { useNewUrlParser: true, useUnifiedTopology: true }, function (err) {
      if (err) {
        mongoLogger.debug("DB Error: ", err);
        process.exit(1);
      } else {
        mongoLogger.info('MongoDB Connected');
      }
    });
  }
}

const instance = new ServerHelper();
export default instance;