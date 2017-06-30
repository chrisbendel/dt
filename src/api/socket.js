import EngineIOClient from "react-native-engine.io-client";
import { AsyncStorage } from "react-native";
import { token } from "./requests";
export default class Socket {
  constructor(ee, user = null, room = null) {
    this.ee = ee;
    this.setSocket().then(sock => {
      this.sock = sock;
      this.listeners();
      if (user) {
        this.connectUser(user._id);
      }
      if (room) {
        this.joinRoom(room);
      }
    });
    this.room = null;
    this.setSocket = this.setSocket.bind(this);
    this.connectUser = this.connectUser.bind(this);
    this.joinRoom = this.joinRoom.bind(this);
    this.close = this.close.bind(this);
  }

  setSocket() {
    return token().then(token => {
      return new EngineIOClient({
        hostname: "ws.dubtrack.fm",
        secure: true,
        path: "/ws",
        query: { access_token: token },
        transports: ["websocket", "polling"]
      });
    });
  }

  connectUser(id) {
    if (this.room) {
      this.joinRoom(this.room._id);
    }
    this.sock.send(JSON.stringify({ action: 10, channel: "user:" + id }));
  }

  joinRoom(id) {
    this.room = id;
    this.sock.send(JSON.stringify({ action: 10, channel: "room:" + id }));
  }

  close() {
    this.sock.close();
  }

  listeners() {
    this.sock.on("message", msg => {
      msg = JSON.parse(msg);
      switch (msg.action) {
        case 15:
          switch (msg.message.name) {
            case "chat-message":
              msg = JSON.parse(msg.message.data);
              this.ee.emit("chat", msg);
              break;
            case "new-message":
              msg = JSON.parse(msg.message.data);
              this.ee.emit("privateMessage", msg);
              break;
            case "room_playlist-update":
              msg = JSON.parse(msg.message.data);
              this.ee.emit("newSong", msg);
              break;
            case "chat-skip":
              msg = JSON.parse(msg.message.data);
              this.ee.emit("skipSong", msg);
              break;
            case "user-pause-queue":
              msg = JSON.parse(msg.message.data);
              this.ee.emit("pauseQueue", msg);
              break;
            case "user-join":
              msg = JSON.parse(msg.message.data);
              this.ee.emit("userJoin", msg);
              break;
            default:
            // console.log(msg);
            // console.log(msg.message.name);
          }
          break;
        default:
        // console.log("fallthrough", msg);
      }
    });
  }
}
