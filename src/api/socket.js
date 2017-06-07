import EngineIOClient from "react-native-engine.io-client";
import EventEmitter from "react-native-eventemitter";
import { AsyncStorage } from "react-native";
export default class Socket {
  constructor(user = null, room = null) {
    this.sock = null;
    this.create(user ? user._id : null, room ? room._id : null);
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
          // this.sock.send(
          // JSON.stringify({ action: 10, channel: 'user:' + userid })
          // );
        }
        if (roomid) {
          this.join(roomid);
          this.room = roomid;
        }
        this.sock.on("message", msg => {
          msg = JSON.parse(msg);
          // console.log(msg);
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
                  EventEmitter.emit("newSong", msg);
                  break;
                case "chat-skip":
                  msg = JSON.parse(msg.message.data);
                  EventEmitter.emit("skipSong", msg);
                  break;
                default:
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

  //possibly use this to leave current room when joining a new one.
  // leave(id) {
  //   this.sock.close();
  //   console.log("leaving room");
  //   this.sock.send(
  //     JSON.stringify({
  //       action: 14,
  //       channel: "room:" + id,
  //       presence: { action: 1, data: {} }
  //     })
  //   );
  // }

  join(id) {
    console.log(this.room, id);
    // if (this.room != id) {
    //   this.leave(this.room);
    // }
    console.log("joining room");
    this.sock.send(JSON.stringify({ action: 10, channel: "room:" + id }));
    // this.sock.send(
    //   JSON.stringify({
    //     action: 14,
    //     channel: "room:" + id,
    //     presence: { action: 0, data: {} }
    //   })
    // );
  }
}
