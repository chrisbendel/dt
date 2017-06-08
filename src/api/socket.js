import EngineIOClient from "react-native-engine.io-client";
import EventEmitter from "react-native-eventemitter";
import { AsyncStorage } from "react-native";
export default class Socket {
  constructor(user = null, roomid) {
    this.sock = null;
    this.create(user ? user._id : null, roomid);
    return this.sock;
  }

  create(userid, roomid) {
    return fetch("https://api.dubtrack.fm/auth/token")
      .then(res => res.json())
      .then(json => {
        return new EngineIOClient({
          hostname: "ws.dubtrack.fm",
          secure: true,
          path: "/ws",
          query: { access_token: json.data.token },
          transports: ["websocket", "polling"]
        });
      })
      .then(socket => {
        this.sock = socket;
        this.sock.on("error", e => {
          console.log(e);
        });
        if (userid) {
          this.connectUser(userid);
          this.user = userid;
        }
        this.join(roomid);
        this.sock.on("message", msg => {
          msg = JSON.parse(msg);
          console.log(msg.message);
          switch (msg.action) {
            case 15:
              switch (msg.message.name) {
                case "chat-message":
                  msg = JSON.parse(msg.message.data);
                  EventEmitter.emit("chat", msg);
                  break;
                case "new-message":
                  msg = JSON.parse(msg.message.data);
                  EventEmitter.emit("pm", msg);
                  break;
                case "room_playlist-update":
                  msg = JSON.parse(msg.message.data);
                  console.log(msg);
                  EventEmitter.emit("newSong", msg);
                  break;
                case "chat-skip":
                  msg = JSON.parse(msg.message.data);
                  EventEmitter.emit("skipSong", msg);
                  break;
                case "user-pause-queue":
                  msg = JSON.parse(msg.message.data);
                  EventEmitter.emit("pauseQueue", msg);
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
      });
  }

  connectUser(id) {
    console.log("connecting user");
    this.sock.send(JSON.stringify({ action: 10, channel: "user:" + id }));
  }

  join(id) {
    console.log("joining room");
    this.sock.send(JSON.stringify({ action: 10, channel: "room:" + id }));
  }
}
