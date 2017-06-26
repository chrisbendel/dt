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
  Image,
  WebView,
  TouchableOpacity,
  Dimensions,
  PixelRatio,
  ScrollView
} from "react-native";
import YouTube from "react-native-youtube";
import Socket from "./../api/socket";
import { currentSong, getRoomInfo, joinRoom } from "./../api/requests";
import { Player, MediaStates } from "react-native-audio-toolkit";
import { Actions } from "react-native-router-flux";
// import VolumeSlider from "react-native-volume-slider";
const { height, width } = Dimensions.get("window");

export default class Video extends Component {
  constructor(props) {
    super(props);
    let socket;

    this.state = {
      room: null
    };

    this.ee = this.props.ee;
    this.room = this.props.room;
    this.player = null;

    this.ee.addListener("newSong", song => {
      console.log(song);
      // this.song = null;
      this.getSong(this.room._id);
    });

    this.ee.addListener("pauseQueue", msg => {
      console.log(msg);
      // this.song = null;
      this.getSong(this.room._id);
    });
  }

  componentWillMount() {
    this.getSong(this.room);
  }

  getSong(room) {
    currentSong(this.room._id).then(song => {
      console.log(song);
      if (song.err) {
        this.setState({ song: null, room: room });
      } else {
        this.setState({ song: song, room: room });
      }
    });
  }

  getScStream(url) {
    let key = "?client_id=F8q33BQPCtQHy1sLdye9DriPDNIECjcs";
    if (this.player) {
      this.player.destroy();
    }
    this.player = new Player(url + key).prepare();
  }

  render() {
    let song = this.state.song;
    if (song) {
      switch (song.songInfo.type) {
        case "youtube":
          if (this.player) {
            this.player.destroy();
          }
          return (
            <YouTube
              ref="youtubePlayer"
              videoId={song.songInfo.fkid}
              play={true}
              rel={false}
              fullscreen={false}
              showFullscreenButton={true}
              showinfo={false}
              controls={0}
              apiKey={"AIzaSyBkJJ0ZoT8XbBDYpZ8sVr1OkVev4C5poWI"}
              origin={"https://www.youtube.com"}
              style={styles.player}
            />
          );
          break;
        case "soundcloud":
          this.getScStream(song.songInfo.streamUrl);
          this.player.seek(song.startTime * 1000, () => {
            this.player.play();
          });
          return (
            <View>
              <Image
                style={{ height: 100, width: width }}
                source={{ uri: song.songInfo.images.soundcloud.artwork_url }}
              />
            </View>
          );
          break;
      }
    } else {
      return (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text> Nobody is playing right now </Text>
        </View>
      );
    }
  }
}

const styles = {
  player: {
    alignSelf: "stretch",
    height: 250
  }
};
