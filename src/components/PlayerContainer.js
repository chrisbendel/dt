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
  TouchableOpacity,
  Dimensions
} from "react-native";
import SlidingUpPanel from "react-native-sliding-up-panel";

// import Soundcloud from "react-native-soundcloud";
// import { Actions } from "react-native-router-flux";
import YouTube from "react-native-youtube";
import Socket from "./../api/socket";
import { currentSong } from "./../api/requests";
import { Player } from "react-native-audio-streaming";

//Public API key ripped from the website, can use this for now til i get a response from SC
// const SC = new Soundcloud("F8q33BQPCtQHy1sLdye9DriPDNIECjcs");

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

    // AsyncStorage.getItem("user").then(user => {
    //   user = JSON.parse(user);
    //   if (user) {
    //     socket = new Socket(user._id);
    //   } else {
    //     socket = new Socket();
    //   }

    //   EventEmitter.on("connectUser", id => {
    //     socket.connectUser(id);
    //   });

    //   EventEmitter.on("userAuth", user => {
    //     this.setState({ user: user });
    //   });

    //   EventEmitter.on("newSong", song => {
    //     console.log(song);
    //     this.setState({ song: song, playing: true });
    //   });

    //   EventEmitter.on("skipSong", msg => {
    //     console.log(msg);
    //     this.setState({ song: null, playing: false });
    //     // this.setState({song: song, playing: true});
    //   });

    //   EventEmitter.on("roomJoin", room => {
    //     socket.join(room._id);
    //     if (room.currentSong) {
    //       this.setState({ playing: true, room: room });
    //       this.getSongTime(room);
    //     } else {
    //       this.setState({ playing: false, room: room });
    //     }
    //   });
    // });

    this.state = {
      room: null,
      song: null,
      buffering: false,
      panelOpen: false
    };
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
            console.log(link.type);
            // if (link.type.includes("vorbis")) {
            if (link.type.includes("vorbis")) {
              console.log(typeof link.url);
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
    if (song) {
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
              <Player
                url={
                  song
                  // "https://cf-media.sndcdn.com/RUgfMvPc0UbF.128.mp3?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiKjovL2NmLW1lZGlhLnNuZGNkbi5jb20vUlVnZk12UGMwVWJGLjEyOC5tcDMiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE0OTYwOTY5MzZ9fX1dfQ__&Signature=D6vBVgjU37Nl00mkDtC2Z~TN08GfbjQNHyq3JLwEG6GqMlSqkeWqsyiTtbcvTqWWFP~k8PGuAF85OJrwjzSOD-IFGGPgisB2v9QpKdRXhxc99a496mlwrBq8trCZ7qhK2j2Z1HO21OR-qBG-1uCir3Dr19vZrjofAEA9bDu9JHU3TuSKraF4BamdsNkirGG7yoCYO9IxE-2~Ui-S-Srk9ZMj1S~0f8pXyRISRTOtRalKi2a3HM~t2CTrJYx~MU4gv87HdXsv8vJsLU1JCHwWg3OwhlisiaRYQRoABvMy5hFYj4gPzkhsIzKZ1DPjOSsAKRwzfxnMPTYbyLo2PTJXjA__&Key-Pair-Id=APKAJAGZ7VMH2PFPW6UQ"
                }
              />
              // <Button
              //   onPress={() => {
              //     this.toggleRoomPanel();
              //     console.log(this.panel);
              //     // this.panel.collapsePanel();
              //   }}
              // >
              //   <Text> Press me </Text>
              // </Button>
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
