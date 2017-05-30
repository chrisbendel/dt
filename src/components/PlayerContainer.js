import React, { Component } from "react";
import EventEmitter from "react-native-eventemitter";
import { Container, Footer, FooterTab, Spinner, Icon, Text } from "native-base";
import {
  AsyncStorage,
  Animated,
  View,
  DeviceEventEmitter,
  TouchableOpacity,
  Button,
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

    let socket;

    this.state = {
      room: null,
      song: null,
      panelOpen: false
    };
  }

  componentWillMount() {
    this.getYoutubeStream("4piMRBu-N5U");
    // this.getScStream("11576688");
  }

  _statusChanged(status) {
    console.log(status);
  }

  getScStream(id) {
    var a = performance.now();

    let url =
      "https://api.soundcloud.com/tracks/" +
      id +
      "/stream?client_id=F8q33BQPCtQHy1sLdye9DriPDNIECjcs";
    this.player = new Player(url).prepare(() => {
      this.setState({ song: url });
      var b = performance.now();
      console.log("It took " + (b - a) + " ms.");
    });

    // return fetch(url).then(res => {
    // var a = performance.now();

    //   console.log(res);
    // this.player = new Player(res.url).prepare();
    //   this.setState({ song: res.url });

    // var b = performance.now();
    // console.log("It took " + (b - a) + " ms.");
    // });
  }

  getYoutubeStream(id) {
    let headers = {
      headers: {
        Accept: "text/html",
        "Content-Type": "text/html",
        Referer: "https://www.dubtrack.fm",
        Origin: "https://www.youtube.com"
      }
    };
    var a = performance.now();
    let url = "https://www.youtube.com/get_video_info?html5=1&video_id=" + id;
    // return fetch(url).then(res => res.text()).then(body => {
    //   console.log(body);
    // });
    return fetch(url, headers).then(res => res.text()).then(body => {
      console.log(body);
      let info = qsToJson(body);
      var tmp = info["adaptive_fmts"];
      if (tmp) {
        tmp = tmp.split(",");
        for (i in tmp) {
          tmp[i] = qsToJson(tmp[i]);
        }
        info["adaptive_fmts"] = tmp;
        console.log(tmp);
        for (var link of info["adaptive_fmts"]) {
          console.log(link.type);
          if (link.type.includes("audio/mp4")) {
            this.player = new Player(link.url).prepare();
            this.setState({ song: link.url });
            var b = performance.now();
            console.log("It took " + (b - a) + " ms.");
          }
        }
      }
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
      this.player.play();
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
                  title="Play"
                  onPress={() => {
                    this.player.volume = 100;
                  }}
                />
                <Button
                  title="Pause"
                  onPress={() => {
                    this.player.volume = 0;
                  }}
                />
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
