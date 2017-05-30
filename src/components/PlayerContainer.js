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
import { currentSong } from "./../api/requests";
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
    this.getYoutubeStream("LaLINFjBRPM");
    // this.getScStream("11384003");
    let socket;

    this.state = {
      room: null,
      song: null,
      buffering: false,
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

  getYoutubeStream(id) {
    let url = "https://www.youtube.com/get_video_info?html5=1&video_id=" + id;
    return fetch(url).then(res => {
      res.text().then(body => {
        let info = qsToJson(body);
        var tmp = info["adaptive_fmts"];
        if (tmp) {
          tmp = tmp.split(",");
          for (i in tmp) {
            tmp[i] = qsToJson(tmp[i]);
          }
          info["adaptive_fmts"] = tmp;
          for (var link of info["adaptive_fmts"]) {
            console.log(link);
            if (link.type.includes("audio/mp4")) {
              // if (link.type.includes("audio/orvis")) {
              console.log(link.url);
              this.setState({ song: link.url });
            }
          }
        }
      });
    });
  }

  getSongTime(room) {
    currentSong(room._id).then(song => {
      this.setState({ song: song.data, room: room, playing: true });
    });
  }

  toggleRoomPanel() {
    if (this.panel.state.containerHeight == MAXHEIGHT) {
      this.panel.collapsePanel();
      this.setState({ panelOpen: false });
    } else {
      this.panel.reloadHeight(MAXHEIGHT);
      this.setState({ panelOpen: true });
    }
  }

  render() {
    let playing = this.state.playing;
    let song = this.state.song;
    let room = this.state.room;
    console.log(song);
    if (song) {
      // RNAudioStreamer.setUrl(song);
      this.player = new Player(song);
      return (
        <View>
          <SlidingUpPanel
            ref={panel => {
              this.panel = panel;
            }}
            containerMaximumHeight={height - 22}
            handlerHeight={90}
            allowStayMiddle={false}
            handlerDefaultView={
              <Container>
                <Button
                  onPress={() => {
                    this.player.play();
                    // this.player.play(() => {
                    //   MusicControl.setNowPlaying({
                    //     title: "Billie Jean",
                    //     artwork: "https://i.imgur.com/e1cpwdo.png", // URL or RN's image 3require()
                    //     artist: "Michael Jackson",
                    //     album: "Thriller",
                    //     genre: "Post-disco, Rhythm and Blues, Funk, Dance-pop",
                    //     duration: 294, // (Seconds)
                    //     description: "", // Android Only
                    //     color: 0xffffff, // Notification Color - Android Only
                    //     date: "1983-01-02T00:00:00Z" // Release Date (RFC 3339) - Android Only
                    //   });
                    // });
                    // this.toggleRoomPanel();
                    // console.log(this.panel);
                    // this.panel.collapsePanel();
                  }}
                >
                  <Text> Play </Text>
                </Button>

                <Button
                  onPress={() => {
                    //we can pause or set volume to 0
                    //Pausing might take extra code to reset the current time of the room
                    //Might impact slow loading since youtube takes forever initially anyway.
                    this.player.volume = 0;
                    this.player.pause();
                    // this.toggleRoomPanel();
                    // console.log(this.panel);
                    // this.panel.collapsePanel();
                  }}
                >
                  <Text> Pause </Text>
                </Button>
              </Container>
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
//         ? <YouTube
//             ref="youtubePlayer"
//             videoId={song.songInfo.fkid}
//             play={playing}
//             hidden={false}
//             playsInline={true}
//             showinfo={false}
//             apiKey={"AIzaSyBkJJ0ZoT8XbBDYpZ8sVr1OkVev4C5poWI"}
//             origin={"https://www.youtube.com"}
//             onChangeState={e => {
//               if (e.state == "buffering") {
//                 this.setState({ buffering: true });
//               } else if (e.state == "ended") {
//                 this.setState({ song: null });
//               } else {
//                 this.setState({ buffering: false });
//                 this.refs.youtubePlayer.seekTo(song.startTime);
//               }
//               console.log(e);
//             }}
//             onReady={e => {
//               console.log(e);
//               this.refs.youtubePlayer.seekTo(song.startTime);
//               this.setState({ isReady: true });
//             }}
//             style={styles.player}
//           />
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
