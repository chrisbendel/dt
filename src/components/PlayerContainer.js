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
import { currentSong, getRoomInfo, session, joinRoom } from "./../api/requests";
import { Player, MediaStates } from "react-native-audio-toolkit";
import { Actions } from "react-native-router-flux";
import VolumeSlider from "react-native-volume-slider";

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
      this.song = null;
      this.getSong(room);
    });

    this.ee.addListener("newSong", song => {
      this.song = null;
      this.getSong(this.state.room);
    });

    this.ee.addListener("pauseQueue", msg => {
      this.song = null;
      this.getSong(this.state.room);
    });
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
            <View style={{ opacity: 0 }}>
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
    }
  }

  render() {
    let song = this.state.song;
    let room = this.state.room;
    let Player;

    if (this.state.song) {
      let Player = this.getPlayerContainer(this.state.song);
      return (
        <View style={styles.playerContainer}>
          <TouchableOpacity
            style={{ alignItems: "center" }}
            onPress={() => {
              Actions.Room({
                room: this.state.room,
                title: this.state.room.name
              });
            }}
          >
            <Text numberOfLines={1}>{this.state.room.name}</Text>
            <Text numberOfLines={1}>
              {this.state.song.songInfo.name}
            </Text>
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
          </TouchableOpacity>

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
    height: 300,
    width: 300
  },
  slider: {
    height: 30,
    marginLeft: 7
  }
};
