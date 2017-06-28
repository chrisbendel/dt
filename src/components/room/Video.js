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
import { currentSong, getRoomInfo, joinRoom } from "./../../api/requests";
import { Player, MediaStates } from "react-native-audio-toolkit";
import { Actions } from "react-native-router-flux";
import Loading from "./../Loading";
// import VolumeSlider from "react-native-volume-slider";
const { height, width } = Dimensions.get("window");
const defaultImage =
  "https://vignette1.wikia.nocookie.net/dubstep/images/2/26/Soundcloud-logo.png/revision/latest?cb=20120527192311";

export default class Video extends Component {
  constructor(props) {
    super(props);

    this.state = {
      song: null
    };

    this.ee = this.props.ee;
    this.player = null;

    this.ee.addListener("newSong", song => {
      console.log("new song", song);
      this.getSong();
    });

    this.ee.addListener("pauseQueue", msg => {
      console.log("pause queue", msg);
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
    currentSong(this.props.room._id).then(song => {
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
    if (this.player) {
      this.player.destroy();
    }

    if (!this.state.song) {
      return null;
    }

    if (this.state.song.songInfo.type === "youtube") {
      return (
        <View style={styles.container}>
          <YouTube
            ref={c => {
              this._youTubePlayer = c;
            }}
            videoId={this.state.song.songInfo.fkid}
            play={true}
            rel={false}
            fullscreen={false}
            showinfo={false}
            controls={0}
            apiKey={"AIzaSyDDfWq9i6O9sQxyIOZdKhfqx0EPj87L3-c"}
            origin={"https://www.youtube.com"}
            onReady={e => {
              this._youTubePlayer.seekTo(this.state.song.startTime);
            }}
            onChangeState={e => {
              if (e.state === "buffering") {
                this._youTubePlayer.seekTo(this.state.song.startTime);
              }
            }}
            style={styles.player}
          />
          <Text note numberOfLines={1}>{this.state.song.songInfo.name}</Text>
        </View>
      );
    }

    if (this.state.song.songInfo.type === "soundcloud") {
      // this.player = new Player.play(
      //   this.state.song.songInfo.streamUrl +
      //     "?client_id=F8q33BQPCtQHy1sLdye9DriPDNIECjcs"
      // );
      // this.player.seek(this.state.song.startTime * 1000);
      return (
        <View style={styles.container}>
          <Image
            style={{ height: 100, width: 200 }}
            resizeMode={"contain"}
            source={{
              uri: this.state.song.songInfo.images.thumbnail
                ? this.state.song.songInfo.images.thumbnail
                : defaultImage
            }}
          />
          <Text note numberOfLines={1}>{this.state.song.songInfo.name}</Text>
        </View>
      );
    }
  }
}

const styles = {
  container: {
    alignItems: "center"
  },
  player: {
    width: 220,
    height: 115,
    marginHorizontal: 3,
    marginVertical: 3
  }
};
