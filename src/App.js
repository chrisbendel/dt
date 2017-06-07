import React, { Component } from "react";
import {
  Container,
  Footer,
  Header,
  Content,
  Icon,
  Button,
  Image,
  Text
} from "native-base";
import { View, TouchableOpacity, AsyncStorage } from "react-native";
import EventEmitter from "react-native-eventemitter";

import Lobby from "./components/Lobby";
import Room from "./components/Room";
import Login from "./components/Login";

import Socket from "./api/socket";
import PrivateMessages from "./components/PrivateMessages";
import PlayerContainer from "./components/PlayerContainer";
import { Scene, Router, Actions } from "react-native-router-flux";
import GuestDrawer from "./GuestDrawer";
import UserDrawer from "./UserDrawer";
import "./api/requests";

console.disableYellowBox = true;

const scenes = Actions.create(
  <Scene key="main">
    <Scene key="drawer" open={false} component={UserDrawer}>
      <Scene key="root" tabs={false} drawerIcon={<Icon name="menu" />}>
        <Scene key="Lobby" component={Lobby} title="Lobby" />
        <Scene key="Room" component={Room} title="Room" />
        <Scene key="Messages" component={PrivateMessages} title="Messages" />
        <Scene key="Login" component={Login} title="Login" />
      </Scene>
    </Scene>
  </Scene>
);

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { user: null };
    this.socket = null;
    // EventEmitter.on("login", user => {
    //   // this.socket = new Socket(user._id);
    //   this.setState({ user: user });
    // });

    // EventEmitter.on("logout", () => {
    //   // this.socket = new Socket();
    //   this.setState({ user: null });
    // });

    EventEmitter.on("joinRoom", room => {
      console.log(this.socket);
      if (this.socket) {
        console.log("previous socket");
        this.socket.sock.close();
      }
      this.socket = new Socket(this.state.user, room._id);
    });
  }

  componentWillMount() {
    AsyncStorage.getItem("user").then(user => {
      if (user) {
        let info = JSON.parse(user);
        // this.socket = new Socket(info._id);
        this.setState({ user: info });
      } else {
        // this.socket = new Socket();
        this.setState({ user: null });
      }
    });
  }

  render() {
    // let user = this.state.user;
    // console.log(user);
    // if (user) {
    //   if (user.username && user.password) {
    //     login(user.username, user.password);
    //     fetch("https://api.dubtrack.fm/auth/token")
    //       .then(res => res.json())
    //       .then(json => {
    //         console.log(json);
    //       });
    //   }
    // }

    return (
      <Container>
        <Router scenes={scenes} />
        <PlayerContainer />
      </Container>
    );
  }
}
