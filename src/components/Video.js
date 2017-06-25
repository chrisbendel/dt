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
  TouchableOpacity,
  Dimensions
} from "react-native";
import YouTube from "react-native-youtube";
import Socket from "./../api/socket";
import { currentSong, getRoomInfo, joinRoom } from "./../api/requests";
import { Player, MediaStates } from "react-native-audio-toolkit";
import { Actions } from "react-native-router-flux";
import VolumeSlider from "react-native-volume-slider";
const { height, width } = Dimensions.get("window");
export default class Video extends Component {
  constructor(props) {
    super(props);
    let socket;

    this.state = {
      room: null,
      song: null
    };

    this.ee = this.props.ee;
    this.player = null;

    this.ee.addListener("newSong", song => {
      this.song = null;
      this.getSong(this.props.room._id);
    });

    this.ee.addListener("pauseQueue", msg => {
      this.song = null;
      this.getSong(this.props.room._id);
    });
  }

  componentWillMount() {
    this.song = null;
    this.getSong(this.props.room);
  }

  getSong(room) {
    currentSong(room._id).then(song => {
      if (song.err) {
        this.setState({ song: null, room: room });
      } else {
        this.setState({ song: song, room: room });
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
    if (song) {
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
              <VolumeSlider
                style={styles.slider}
                thumbSize={{
                  width: 8,
                  height: 8
                }}
                thumbTintColor="rgb(146,146,157)"
                minimumTrackTintColor="rgb(146,146,157)"
                maximumTrackTintColor="rgba(255,255,255, 0.1)"
              />
            </View>
          );
          break;
        case "soundcloud":
          console.log(song.songInfo.images.thumbnail);
          this.getScStream(song.songInfo.streamUrl);
          this.player.seek(song.startTime * 1000, () => {
            this.player.play();
          });
          return (
            <View>
              <Image
                style={{ height: 350, width: width }}
                source={{ uri: song.songInfo.images.soundcloud.artwork_url }}
              />
              <VolumeSlider
                style={styles.slider}
                thumbSize={{
                  width: 8,
                  height: 8
                }}
                thumbTintColor="rgb(146,146,157)"
                minimumTrackTintColor="rgb(146,146,157)"
                maximumTrackTintColor="rgba(255,255,255, 0.1)"
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

  render() {
    let song = this.state.song;
    let room = this.props.room;
    console.log(song);
    let Player = this.getPlayerContainer(this.state.song);
    return (
      <View style={{ marginVertical: 50 }}>
        {Player}
      </View>
    );
  }
}

const styles = {
  playerContainer: {
    alignItems: "center"
  },
  youtube: {
    alignSelf: "stretch",
    height: 350
  },
  slider: {
    height: 30,
    marginLeft: 7
  }
};
