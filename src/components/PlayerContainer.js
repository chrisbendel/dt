import React, { Component } from "react";
import EventEmitter from "react-native-eventemitter";
import {
  Container,
  Content,
  Col,
  Grid,
  Row,
  Footer,
  FooterTab,
  Spinner,
  Button,
  Icon,
  Text
} from "native-base";
import {
  AsyncStorage,
  Animated,
  View,
  DeviceEventEmitter,
  TouchableOpacity,
  Dimensions
} from "react-native";
import YouTube from "react-native-youtube";
import Socket from "./../api/socket";
import { currentSong, getRoomInfo } from "./../api/requests";
import { Player, MediaStates } from "react-native-audio-toolkit";
// import MusicControl from "react-native-music-control";

export default class PlayerContainer extends Component {
  constructor(props) {
    super(props);
    let socket;

    this.state = {
      room: null,
      song: null
    };

    this.player = null;

    EventEmitter.on("joinRoom", room => {
      this.getSong(room._id);
      this.setState({ room: room });
      // getRoomInfo(room._id).then(room => {
      //   if (room.currentSong) {
      //     currentSong(room._id).then(song => {
      //       this.setState({ room: room, song: song });
      //     });
      //   } else {
      //     this.setState({ room: room });
      //   }
      // });
    });

    EventEmitter.on("newSong", song => {
      this.getSong(this.state.room._id);
      // console.log(song);
      // this.setState({ song: song });
    });

    EventEmitter.on("pauseQueue", msg => {
      this.getSong(this.state.room._id);
      // console.log(msg);
      // this.setState({ song: null });
    });
  }

  getSong(roomID) {
    currentSong(roomID).then(song => {
      if (this.player) {
        this.player.destroy();
      }
      if (song) {
        this.setState({ song: song });
      } else {
        this.setState({ song: null });
      }
    });
  }

  _statusChanged(status) {
    console.log("status: ", status);
  }

  getScStream(url) {
    // let url =
    //   "https://api.soundcloud.com/tracks/" +
    //   id +
    //   "/stream?client_id=F8q33BQPCtQHy1sLdye9DriPDNIECjcs";
    let key = "?client_id=F8q33BQPCtQHy1sLdye9DriPDNIECjcs";
    this.player = new Player(url + key).prepare();
    // return fetch(url).then(res => {
    //   this.player = new Player(res.url, {
    //     autoDestroy: true,
    //     continuesToPlayInBackground: true
    //   }).prepare();
    // });
  }

  //TODO Put media controls in here
  getPlayerContainer(song) {
    switch (song.songInfo.type) {
      case "youtube":
        return (
          <View>
            <YouTube
              ref="youtubePlayer"
              videoId={song.songInfo.fkid}
              play={true}
              rel={false}
              showFullscreenButton={false}
              showinfo={false}
              controls={0}
              apiKey={"AIzaSyBkJJ0ZoT8XbBDYpZ8sVr1OkVev4C5poWI"}
              origin={"https://www.youtube.com"}
              // This logic needs work...
              onChangeState={e => {
                if (e.state == "buffering") {
                  this.setState({ buffering: true });
                } else if (e.state == "ended") {
                  this.setState({ song: null });
                } else {
                  this.setState({ buffering: false });
                  this.refs.youtubePlayer.seekTo(song.startTime);
                }
                console.log(e);
              }}
              onReady={e => {
                console.log(e);
                this.refs.youtubePlayer.seekTo(song.startTime);
              }}
              style={styles.player}
            />
            <Button transparent>
              <Icon name="arrow-up" />
            </Button>
            <Button transparent>
              <Icon name="arrow-down" />
            </Button>
            <Button transparent>
              <Icon name="volume-up" />
            </Button>
            <Button transparent>
              <Icon name="arrow-up" />
            </Button>
          </View>
        );
        break;
      case "soundcloud":
        this.getScStream(song.songInfo.streamUrl);
        // .then(() => {
        //player handles duration of songs in ms, not seconds
        this.player.seek(song.startTime * 1000, () => {
          this.player.play();
          return (
            <View>
              <Button transparent>
                <Icon name="arrow-up" />
              </Button>
              <Button transparent>
                <Icon name="arrow-up" />
              </Button>
              <Button transparent>
                <Icon name="arrow-up" />
              </Button>
              <Button transparent>
                <Icon name="arrow-up" />
              </Button>
            </View>
          );
          // });
        });
        break;
      default:
        return null;
    }
  }

  render() {
    let song = this.state.song;
    let room = this.state.room;
    if (room && song) {
      let playerContainer = this.getPlayerContainer(song);
      return (
        <Footer>
          <FooterTab>
            {playerContainer}
          </FooterTab>
        </Footer>
      );
    } else {
      return (
        <Footer>
          <FooterTab>
            <Button>
              <Text>Noone is playing right now.</Text>
            </Button>
          </FooterTab>
        </Footer>
      );
    }
  }
}

const styles = {
  container: {
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center"
  },
  playerContainer: {
    backgroundColor: "#f8f8f8",
    height: 80
  },
  info: {
    alignItems: "center"
  },
  controls: {
    flexDirection: "row"
  },
  player: {
    alignSelf: "stretch",
    height: 1,
    width: 1
  }
};

// Ignored for now, get_video_info issue needs resolving with copyright stuff
// Add this back to the class if it ever works again
// getYoutubeStream(id) {
//   let url = "https://www.youtube.com/get_video_info?video_id=" + id;
//   return fetch(url, headers).then(res => {
//     res.text().then(body => {
//       console.log(body);
//       let info = qsToJson(body);
//       var tmp = info["adaptive_fmts"];
//       if (tmp) {
//         tmp = tmp.split(",");
//         for (i in tmp) {
//           tmp[i] = qsToJson(tmp[i]);
//         }
//         info["adaptive_fmts"] = tmp;
//         for (var link of info["adaptive_fmts"]) {
//           console.log(link);
//           if (link.type.includes("audio/mp4")) {
// this.player = new Player(link.url).prepare();
//             // if (link.type.includes("audio/orvis")) {
//             // console.log(link.url);
//             this.setState({ song: link.url });
//           }
//         }
//       }
//     });
//   });
// }

// function qsToJson(qs) {
//   var res = {};
//   var pars = qs.split("&");
//   var kv, k, v;
//   for (i in pars) {
//     kv = pars[i].split("=");
//     k = kv[0];
//     v = kv[1];
//     res[k] = decodeURIComponent(v);
//   }
//   return res;
// }
