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
import Loading from "./Loading";
// import VolumeSlider from "react-native-volume-slider";
const { height, width } = Dimensions.get("window");
const defaultImage =
  "https://vignette1.wikia.nocookie.net/dubstep/images/2/26/Soundcloud-logo.png/revision/latest?cb=20120527192311";

export default class Video extends Component {
  constructor(props) {
    super(props);
    let socket;

    this.state = {
      song: null
    };

    this.ee = this.props.ee;
    this.room = this.props.room;
    this.player = null;

    this.ee.addListener("newSong", song => {
      this.getSong();
    });

    this.ee.addListener("pauseQueue", msg => {
      this.getSong();
    });
  }

  componentDidMount() {
    // if (this.player) {
    //   this.player.destroy();
    // }
    this.getSong();
  }

  componentWillUnmount() {
    // if (this.player) {
    //   this.player.destroy();
    // }
    this.setState({ song: null });
  }

  getSong() {
    currentSong(this.room._id).then(song => {
      this.setState({ song: song });
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
    if (this.player) {
      this.player.destroy();
    }

    if (!song) {
      return null;
    }

    if (song.songInfo.type === "youtube") {
      return (
        <View style={styles.container}>
          <YouTube
            ref={c => {
              this._youTubePlayer = c;
            }}
            videoId={song.songInfo.fkid}
            play={true}
            rel={false}
            fullscreen={false}
            showFullscreenButton={true}
            showinfo={false}
            controls={0}
            apiKey={"AIzaSyBkJJ0ZoT8XbBDYpZ8sVr1OkVev4C5poWI"}
            origin={"https://www.youtube.com"}
            onChangeState={e => {
              console.log(e);
              // if (e.state == "buffering") {
              //   this._youTubePlayer.seekTo(song.startTime);
              // }
            }}
            style={styles.player}
          />
        </View>
      );
    }

    if (song.songInfo.type === "soundcloud") {
      this.player = new Player.play(
        this.songInfo.streamUrl + "?client_id=F8q33BQPCtQHy1sLdye9DriPDNIECjcs"
      );
      this.player.seek(song.startTime * 1000);
      return (
        <View style={styles.container}>
          <Image
            style={{ height: 100, width: 200 }}
            resizeMode={"contain"}
            source={{
              uri: song.songInfo.images.thumbnail
                ? song.songInfo.images.thumbnail
                : defaultImage
            }}
          />
          <Text note numberOfLines={1}>{song.songInfo.name}</Text>
        </View>
      );
    }
  }
}

const styles = {
  container: {
    alignItems: "center",
    width: width
  },
  player: {
    height: 150,
    width: 210,
    marginHorizontal: 10,
    marginVertical: 3
  }
};
