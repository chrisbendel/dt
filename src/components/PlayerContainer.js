import React, { Component } from "react";
import {
  Container,
  Content,
  Footer,
  FooterTab,
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
import YouTube from "react-native-youtube";
import Socket from "./../api/socket";
import { currentSong, getRoomInfo, session } from "./../api/requests";
import { Player, MediaStates } from "react-native-audio-toolkit";
// import MusicControl from "react-native-music-control";
import { SliderVolumeController } from "react-native-volume-controller";

export default class PlayerContainer extends Component {
  constructor(props) {
    super(props);
    let socket;

    this.state = {
      room: null,
      song: null
    };

    this.ee = this.props.ee;
    this.player = null;

    this.ee.addListener("joinRoom", room => {
      console.log(room);
      this.song = null;
      this.getSong(room);
    });

    this.ee.addListener("newSong", song => {
      this.getSong(this.state.room);
    });

    this.ee.addListener("pauseQueue", msg => {
      this.getSong(this.state.room);
    });
  }

  componentWillMount() {
    console.log(this.state);
  }

  getSong(room) {
    currentSong(room._id).then(song => {
      // if (this.player) {
      //   console.log(this.player);
      //   this.player.destroy();
      // }
      if (song) {
        this.setState({ song: song, room: room });
      } else {
        this.setState({ song: null, room: room });
      }
    });
  }

  _statusChanged(status) {
    console.log("status: ", status);
  }

  getScStream(url) {
    let key = "?client_id=F8q33BQPCtQHy1sLdye9DriPDNIECjcs";
    if (this.player) {
      console.log(this.player);
      this.player.destroy();
    }
    this.player = new Player(url + key).prepare();
  }

  //TODO Put media controls in here
  getPlayerContainer(song) {
    console.log(this.player);
    if (song.songInfo) {
      console.log("songinfo", song.songInfo);
      switch (song.songInfo.type) {
        case "youtube":
          if (this.player) {
            console.log("destroying", this.player);
            this.player.destroy();
          }
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
                style={styles.youtube}
              />
            </View>
          );
          break;
        case "soundcloud":
          this.getScStream(song.songInfo.streamUrl);
          this.player.seek(song.startTime * 1000, () => {
            this.player.play();
          });
          return <View />;
          break;
      }
    } else {
      return (
        <Footer>
          <FooterTab>
            <Button
              onPress={() => {
                session();
              }}
            >
              <Text>Noone is playing right now</Text>
            </Button>
          </FooterTab>
        </Footer>
      );
    }
  }

  render() {
    let song = this.state.song;
    let room = this.state.room;
    let Player;
    if (room) {
      console.log(song);
      let Player = this.getPlayerContainer(song);
      return (
        <View style={styles.playerContainer}>
          <View style={{ alignItems: "center" }}>
            <Text numberOfLines={1}>{room.name}</Text>
            {song.songInfo
              ? <Text numberOfLines={1}>
                  {song.songInfo.name}
                </Text>
              : null}
            {song.songInfo
              ? <SliderVolumeController style={{ marginTop: 15 }} />
              : null}
          </View>

          {Player}
        </View>
      );
    } else {
      return null;
    }
  }
}

const styles = {
  playerContainer: {
    backgroundColor: "#f8f8f8",
    height: 80
  },
  youtube: {
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
