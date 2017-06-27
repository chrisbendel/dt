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
import {
  View,
  Platform,
  PixelRatio,
  Dimensions,
  TouchableOpacity,
  AsyncStorage
} from "react-native";
import EventEmitter from "EventEmitter";

import Lobby from "./components/Lobby";
import Room from "./components/Room";
import Login from "./components/Login";
import Socket from "./api/socket";
import Conversation from "./components/Conversation";
import PrivateMessages from "./components/PrivateMessages";
import { Scene, Router, Actions } from "react-native-router-flux";
import DrawerNav from "./DrawerNav";
import KeyboardSpace from "react-native-keyboard-space";

console.disableYellowBox = true;

const ee = new EventEmitter();

export default class App extends Component {
  constructor(props) {
    super(props);
    this.socket = null;
    this.state = {
      room: null
    };

    ee.addListener("logout", () => {
      this.setState({ user: null });
      this.socket.close();
      this.socket = new Socket(ee);
    });

    ee.addListener("login", user => {
      this.setState({ user: user });
      this.socket.close();
      this.socket = new Socket(ee, user);
    });

    ee.addListener("joinRoom", room => {
      this.socket.close();
      this.socket = new Socket(ee, this.state.user, room._id);
      // this.setState({ room: room });
    });
  }

  componentWillMount() {
    AsyncStorage.getItem("user").then(user => {
      this.socket = new Socket(ee, JSON.parse(user));
      this.setState({ user: JSON.parse(user) });
    });
  }

  render() {
    return (
      <Router>
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
              <Scene
                key="Conversation"
                ee={ee}
                component={Conversation}
                title="Conversation"
              />
              <Scene key="Login" ee={ee} component={Login} title="Log In" />
            </Scene>
          </Scene>
        </Scene>
      </Router>
    );
  }
}
