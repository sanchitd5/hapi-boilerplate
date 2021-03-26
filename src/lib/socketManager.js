import Hapi from "@hapi/hapi";
import SocketIO from "socket.io";
/**
* Please use socketLogger for logging in this file try to abstain from console
* levels of logging:
* - TRACE - ‘blue’
* - DEBUG - ‘cyan’
* - INFO - ‘green’
* - WARN - ‘yellow’
* - ERROR - ‘red’
* - FATAL - ‘magenta’
*/

class SocketManager {

    /**
     * 
     * @param {Hapi.Server} server HAPI Server
     */
    connectSocket = (server) => {
        const io = SocketIO().listen(server.listener);
        socketLogger.info("socket server started");
        io.on('connection', function (socket) {
            socketLogger.info("connection established: ", socket.id);
            socket.emit('message', {
                message: {
                    type: 'connection', statusCode: 200,
                    statusMessage: 'WELCOME TO ', data: ""
                }
            });
        })
    }
}

const instance = new SocketManager();
export default instance;



