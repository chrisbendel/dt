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
// import EventEmitter from "react-native-eventemitter";
import EventEmitter from "EventEmitter";

import Lobby from "./components/Lobby";
import Room from "./components/Room";
import Login from "./components/Login";
import Socket from "./api/socket";
import PrivateMessages from "./components/PrivateMessages";
import PlayerContainer from "./components/PlayerContainer";
import { Scene, Router, Actions } from "react-native-router-flux";
import DrawerNav from "./DrawerNav";
import "./api/requests";

console.disableYellowBox = true;

const ee = new EventEmitter();

const scenes = Actions.create(
  <Scene key="main" type="reset">
    <Scene key="drawer" open={false} ee={ee} component={DrawerNav}>
      <Scene key="root" tabs={false} drawerIcon={<Icon name="menu" />}>
        <Scene key="Lobby" ee={ee} component={Lobby} title="Lobby" />
        <Scene key="Room" ee={ee} component={Room} title="Room" />
        <Scene
          key="Messages"
          ee={ee}
          component={PrivateMessages}
          title="Messages"
        />
        <Scene key="Login" ee={ee} component={Login} title="Log In" />
      </Scene>
    </Scene>
  </Scene>
);

export default class App extends Component {
  constructor(props) {
    super(props);
    this.socket = null;

    ee.addListener("logout", () => {
      this.socket.close();
      this.socket = new Socket(ee);
    });

    ee.addListener("login", user => {
      this.socket.close();
      this.socket = new Socket(ee, user);
    });

    ee.addListener("joinRoom", room => {
      this.socket.joinRoom(room._id);
    });
  }

  componentWillMount() {
    AsyncStorage.getItem("user").then(user => {
      this.socket = new Socket(ee, user);
    });
  }

  render() {
    return (
      <Container>
        <Router scenes={scenes} />
        <PlayerContainer ee={ee} />
      </Container>
    );
  }
}
