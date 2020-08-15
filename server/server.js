import ServerHelper from "./helpers";
import SocketManager from "../lib/socketManager";
import Routes from "../routes";
import BootStrap from "../utils/bootStrap";

const initServer = async () => {
  //Create Server
  const server = ServerHelper.createServer();

  //Register All Plugins
  await ServerHelper.registerPlugins(server);

  //add views
  ServerHelper.addViews(server);

  //Default Routes
  ServerHelper.setDefaultRoute(server)

  server.route(Routes);

  SocketManager.connectSocket(server);

  BootStrap.bootstrapAdmin(function (err) {
    if (err) appLogger.debug(err)
  });

  server.events.on("response", function (request) {
    appLogger.info(
      `${request.info.remoteAddress} : ${request.method.toUpperCase()} ${request.url.pathname} --> ${request.response.statusCode}`);
    appLogger.info("Request payload:", request.payload);
  });

  // Start Server
  ServerHelper.startServer(server);
}

export const startMyServer = () => {

  ServerHelper.configureLog4js();

  ServerHelper.connectMongoDB();

  // Global variable to get app root folder path
  ServerHelper.setGlobalAppRoot();

  process.on("unhandledRejection", err => {
    appLogger.fatal(err);
    process.exit(1);
  });

  initServer();
}
