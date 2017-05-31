import React, { Component } from "react";
import EventEmitter from "react-native-eventemitter";
import {
  Container,
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
import SlidingUpPanel from "react-native-sliding-up-panel";
import YouTube from "react-native-youtube";
import Socket from "./../api/socket";
import { currentSong, getRoomInfo } from "./../api/requests";
import { Player, MediaStates } from "react-native-audio-toolkit";
// import MusicControl from "react-native-music-control";

const { height, width } = Dimensions.get("window");
const MAXHEIGHT = height - 22;

function qsToJson(qs) {
  var res = {};
  var pars = qs.split("&");
  var kv, k, v;
  for (i in pars) {
    kv = pars[i].split("=");
    k = kv[0];
    v = kv[1];
    res[k] = decodeURIComponent(v);
  }
  return res;
}

export default class PlayerContainer extends Component {
  constructor(props) {
    super(props);
    // this.getScStream("11384003");
    let socket;

    EventEmitter.on("joinRoom", id => {
      getRoomInfo(id).then(room => {
        if (room.currentSong) {
          currentSong(room._id).then(song => {
            this.setState({ room: room, song: song });
          });
        } else {
          this.setState({ room: room });
        }
      });
      // this.toggleRoomPanel();
    });

    this.state = {
      room: null,
      song: null,
      panelOpen: false
    };
  }

  _statusChanged(status) {
    console.log(status);
  }

  getScStream(id) {
    let url =
      "https://api.soundcloud.com/tracks/" +
      id +
      "/stream?client_id=F8q33BQPCtQHy1sLdye9DriPDNIECjcs";
    return fetch(url).then(res => {
      this.setState({ song: res.url });
    });
  }

  // getSongTime(room) {
  //   currentSong(room._id).then(song => {
  //     this.setState({ room: room });
  //   });
  // }

  toggleRoomPanel() {
    if (this.panel.state.containerHeight == MAXHEIGHT) {
      this.panel.collapsePanel();
      this.setState({ panelOpen: false });
    } else {
      this.panel.reloadHeight(MAXHEIGHT);
      this.setState({ panelOpen: true });
    }
  }

  //TODO Put media controls in here
  setPlayerInfo(song) {
    console.log(song);
    switch (song.songInfo.type) {
      case "youtube":
        return (
          <Container>
            <Text> HELLO </Text>
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
              //This logic needs work...
              // onChangeState={e => {
              //   if (e.state == "buffering") {
              //     this.setState({ buffering: true });
              //   } else if (e.state == "ended") {
              //     this.setState({ song: null });
              //   } else {
              //     this.setState({ buffering: false });
              //     this.refs.youtubePlayer.seekTo(song.startTime);
              //   }
              //   console.log(e);
              // }}
              onReady={e => {
                console.log(e);
                this.refs.youtubePlayer.seekTo(song.startTime);
              }}
              style={styles.player}
            />
            <Button
              onPress={() => {
                console.log(this.refs.youtubePlayer);
                // this.refs.youtubePlayer.mute();
              }}
            >
              <Text>press</Text>
            </Button>
          </Container>
        );
        console.log("youtube", song);
        break;
      case "soundcloud":
        this.getScStream(song.songInfo.fkid);
        console.log("soundcloud", song);
        break;
      default:
        return null;
    }
  }

  render() {
    let song = this.state.song;
    let room = this.state.room;
    let playerContainer;
    // let playerContainer = this.setPlayerInfo(song);
    if (room) {
      if (song) {
        playerContainer = this.setPlayerInfo(song);
      }
      // RNAudioStreamer.setUrl(song);
      return (
        <View style={{ paddingBottom: 90 }}>
          <SlidingUpPanel
            ref={panel => {
              this.panel = panel;
            }}
            containerMaximumHeight={height - 22}
            containerHeight={height - 22}
            handlerHeight={90}
            allowStayMiddle={false}
            handlerDefaultView={
              playerContainer
              // <Container>
              //   <Button
              //     onPress={() => {
              //       this.player.play();
              //     }}
              //   >
              //     <Text> Play </Text>
              //   </Button>

              //   <Button
              //     onPress={() => {
              //       this.player.volume = 0;
              //       this.player.pause();
              //       // this.toggleRoomPanel();
              //       // console.log(this.panel);
              //       // this.panel.collapsePanel();
              //     }}
              //   >
              //     <Text> Pause </Text>
              //   </Button>
              // </Container>
            }
          >
            <View style={styles.frontContainer}>
              <Text style={styles.panelText}>Hello guys!</Text>
            </View>
          </SlidingUpPanel>
        </View>
      );
    } else {
      return null;
    }
  }
}

//   return (
//     <View style={styles.playerContainer}>
//       {song
// ? <YouTube
//     ref="youtubePlayer"
//     videoId={song.songInfo.fkid}
//     play={playing}
//     hidden={false}
//     playsInline={true}
//     showinfo={false}
//     apiKey={"AIzaSyBkJJ0ZoT8XbBDYpZ8sVr1OkVev4C5poWI"}
//     origin={"https://www.youtube.com"}
//     onChangeState={e => {
//       if (e.state == "buffering") {
//         this.setState({ buffering: true });
//       } else if (e.state == "ended") {
//         this.setState({ song: null });
//       } else {
//         this.setState({ buffering: false });
//         this.refs.youtubePlayer.seekTo(song.startTime);
//       }
//       console.log(e);
//     }}
//     onReady={e => {
//       console.log(e);
//       this.refs.youtubePlayer.seekTo(song.startTime);
//       this.setState({ isReady: true });
//     }}
//     style={styles.player}
//   />
//         : null}
//       <View style={styles.info}>
//         <Text
//           style={{ fontSize: 11, fontWeight: "bold" }}
//           numberOfLines={1}
//         >
//           {room.name}
//         </Text>
//       </View>
//       {song
//         ? <View style={styles.info}>
//             <Text style={{ fontSize: 11 }} numberOfLines={1}>
//               {song.songInfo.name}
//             </Text>
//           </View>
//         : null}
//       <Footer style={{ borderTopWidth: 0 }}>
//         <FooterTab>
//           <Button
//             onPress={() => {
//               //updub the song
//             }}
//           >
//             <Icon name="ios-arrow-up" />
//           </Button>
//           <Button
//             onPress={() => {
//               //downdub song
//             }}
//           >
//             <Icon name="ios-arrow-down" />
//           </Button>
//           <Button
//             onPress={() => {
//               Actions.room({ title: room.name });
//             }}
//           >
//             <Icon name="ios-chatbubbles" />
//           </Button>
//           <Button
//             onPress={() => {
//               if (playing) {
//                 this.setState({ playing: false });
//               } else {
//                 this.getSongTime(room);
//               }
//             }}
//           >
//             {this.state.buffering
//               ? <Spinner color="black" />
//               : // <Icon name=".ion-loading-c"/>
//                 <Icon
//                   name={playing ? "ios-volume-up" : "ios-volume-off"}
//                 />}
//           </Button>
//         </FooterTab>
//       </Footer>
//     </View>
//   );
// } else {
//   return null;
// }
// }
// }

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
//             this.player = new Player(link.url).prepare();
//             // if (link.type.includes("audio/orvis")) {
//             // console.log(link.url);
//             this.setState({ song: link.url });
//           }
//         }
//       }
//     });
//   });
// }
