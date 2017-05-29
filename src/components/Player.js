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
import { AsyncStorage, View } from "react-native";
import Soundcloud from "react-native-soundcloud";
import { Actions } from "react-native-router-flux";
import YouTube from "react-native-youtube";
import app from "./app";
import Socket from "./API/socket";

//Public API key ripped from the website, can use this for now til i get a response from SC
const SC = new Soundcloud("F8q33BQPCtQHy1sLdye9DriPDNIECjcs");

export default class Player extends Component {
  constructor(props) {
    super(props);

    let socket;

    AsyncStorage.getItem("user").then(user => {
      user = JSON.parse(user);
      if (user) {
        socket = new Socket(user._id);
      } else {
        socket = new Socket();
      }

      EventEmitter.on("connectUser", id => {
        socket.connectUser(id);
      });

      EventEmitter.on("userAuth", user => {
        this.setState({ user: user });
      });

      EventEmitter.on("newSong", song => {
        console.log(song);
        this.setState({ song: song, playing: true });
      });

      EventEmitter.on("skipSong", msg => {
        console.log(msg);
        this.setState({ song: null, playing: false });
        // this.setState({song: song, playing: true});
      });

      EventEmitter.on("roomJoin", room => {
        socket.join(room._id);
        if (room.currentSong) {
          this.setState({ playing: true, room: room });
          this.getSongTime(room);
        } else {
          this.setState({ playing: false, room: room });
        }
      });
    });

    this.state = {
      room: null,
      song: null,
      buffering: false
    };
  }

  getSongTime(room) {
    app.user.currentSong(room._id).then(song => {
      this.setState({ song: song.data, room: room, playing: true });
    });
  }

  render() {
    let playing = this.state.playing;
    let song = this.state.song;
    let room = this.state.room;
    if (room) {
      return (
        <View style={styles.playerContainer}>
          {song
            ? <YouTube
                ref="youtubePlayer"
                videoId={song.songInfo.fkid}
                play={playing}
                hidden={false}
                playsInline={true}
                showinfo={false}
                apiKey={"AIzaSyBkJJ0ZoT8XbBDYpZ8sVr1OkVev4C5poWI"}
                origin={"https://www.youtube.com"}
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
                  this.setState({ isReady: true });
                }}
                style={styles.player}
              />
            : null}
          <View style={styles.info}>
            <Text
              style={{ fontSize: 11, fontWeight: "bold" }}
              numberOfLines={1}
            >
              {room.name}
            </Text>
          </View>
          {song
            ? <View style={styles.info}>
                <Text style={{ fontSize: 11 }} numberOfLines={1}>
                  {song.songInfo.name}
                </Text>
              </View>
            : null}
          <Footer style={{ borderTopWidth: 0 }}>
            <FooterTab>
              <Button
                onPress={() => {
                  //updub the song
                }}
              >
                <Icon name="ios-arrow-up" />
              </Button>
              <Button
                onPress={() => {
                  //downdub song
                }}
              >
                <Icon name="ios-arrow-down" />
              </Button>
              <Button
                onPress={() => {
                  Actions.room({ title: room.name });
                }}
              >
                <Icon name="ios-chatbubbles" />
              </Button>
              <Button
                onPress={() => {
                  if (playing) {
                    this.setState({ playing: false });
                  } else {
                    this.getSongTime(room);
                  }
                }}
              >
                {this.state.buffering
                  ? <Spinner color="black" />
                  : // <Icon name=".ion-loading-c"/>
                    <Icon
                      name={playing ? "ios-volume-up" : "ios-volume-off"}
                    />}
              </Button>
            </FooterTab>
          </Footer>
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
