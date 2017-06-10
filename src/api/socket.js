import EngineIOClient from "react-native-engine.io-client";
// import EventEmitter from "react-native-eventemitter";
import { AsyncStorage } from "react-native";
import { token } from "./requests";
export default class Socket {
  constructor(ee, user = null) {
    this.ee = ee;
    this.setSocket().then(() => {
      this.listeners();
      if (user) {
        this.connectUser(user._id);
      }
      return this.sock;
    });

    this.setSocket = this.setSocket.bind(this);
    this.connectUser = this.connectUser.bind(this);
    this.joinRoom = this.joinRoom.bind(this);
    this.close = this.close.bind(this);
  }

  setSocket() {
    console.log("creating new socket!");
    return token().then(token => {
      return (this.sock = new EngineIOClient({
        hostname: "ws.dubtrack.fm",
        secure: true,
        path: "/ws",
        query: { access_token: token },
        transports: ["websocket", "polling"]
      }));
    });
  }

  connectUser(id) {
    console.log("connecting user");
    this.sock.send(JSON.stringify({ action: 10, channel: "user:" + id }));
  }

  joinRoom(id) {
    console.log("joining room");
    this.sock.send(JSON.stringify({ action: 10, channel: "room:" + id }));
  }

  close() {
    console.log("closing socket");
    this.sock.close();
  }

  listeners() {
    this.sock.on("message", msg => {
      msg = JSON.parse(msg);
      console.log(msg.message);
      switch (msg.action) {
        case 15:
          switch (msg.message.name) {
            case "chat-message":
              msg = JSON.parse(msg.message.data);
              // EventEmitter.emit("chat", msg);
              this.ee.emit("chat", msg);
              break;
            case "new-message":
              msg = JSON.parse(msg.message.data);
              this.ee.emit("pm", msg);
              break;
            case "room_playlist-update":
              msg = JSON.parse(msg.message.data);
              console.log(msg);
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
            default:
              console.log(msg);
              console.log(msg.message.name);
          }
          break;
        default:
        // console.log('fallthrough', msg);
      }
    });
  }

  // create(userid, roomid) {
  //   token()
  //     .then(token => {
  //       return new EngineIOClient({
  //         hostname: "ws.dubtrack.fm",
  //         secure: true,
  //         path: "/ws",
  //         query: { access_token: token },
  //         transports: ["websocket", "polling"]
  //       });
  //     })
  // .then(socket => {
  //   this.sock = socket;
  //   this.sock.on("error", e => {
  //     console.log(e);
  //   });
  // if (userid) {
  //   this.connectUser(userid);
  //   this.user = userid;
  // }
  // this.join(roomid);
  //       this.sock.on("message", msg => {
  //         msg = JSON.parse(msg);
  //         console.log(msg.message);
  //         switch (msg.action) {
  //           case 15:
  //             switch (msg.message.name) {
  //               case "chat-message":
  //                 msg = JSON.parse(msg.message.data);
  //                 EventEmitter.emit("chat", msg);
  //                 break;
  //               case "new-message":
  //                 msg = JSON.parse(msg.message.data);
  //                 EventEmitter.emit("pm", msg);
  //                 break;
  //               case "room_playlist-update":
  //                 msg = JSON.parse(msg.message.data);
  //                 console.log(msg);
  //                 EventEmitter.emit("newSong", msg);
  //                 break;
  //               case "chat-skip":
  //                 msg = JSON.parse(msg.message.data);
  //                 EventEmitter.emit("skipSong", msg);
  //                 break;
  //               case "user-pause-queue":
  //                 msg = JSON.parse(msg.message.data);
  //                 EventEmitter.emit("pauseQueue", msg);
  //                 break;
  //               default:
  //                 console.log(msg);
  //                 console.log(msg.message.name);
  //             }
  //             break;
  //           default:
  //           // console.log('fallthrough', msg);
  //         }
  //       });
  //     });
  // }
}
