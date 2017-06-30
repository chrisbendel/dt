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
import Settings from "./components/Settings";
import Socket from "./api/socket";
import Conversation from "./components/Conversation";
import PrivateMessages from "./components/PrivateMessages";
import { Scene, Router, Actions } from "react-native-router-flux";

console.disableYellowBox = true;
const ee = new EventEmitter();

export default class App extends Component {
  constructor(props) {
    super(props);
    this.socket = null;

    this.state = {
      user: null
    };

    ee.addListener("logout", () => {
      this.socket.close();
      this.socket = new Socket(ee);
      this.setState({ user: null });
    });

    ee.addListener("login", user => {
      this.socket.close();
      this.socket = new Socket(ee, user);
      this.setState({ user: user });
    });

    ee.addListener("joinRoom", room => {
      this.socket.close();
      this.socket = new Socket(ee, this.state.user, room._id);
    });
  }

  componentWillMount() {
    AsyncStorage.getItem("user").then(user => {
      this.socket = new Socket(ee, JSON.parse(user));
      this.setState({ user: JSON.parse(user) });
    });
  }

  renderLeftButton = () => {
    return (
      <TouchableOpacity
        style={{ justifyContent: "center", alignItems: "center" }}
        onPress={() => {
          Actions.Settings({ user: this.state.user });
        }}
      >
        <Icon name="settings" />
      </TouchableOpacity>
    );
  };

  renderRightButton = () => {
    if (this.state.user) {
      return (
        <TouchableOpacity
          style={{ justifyContent: "center", alignItems: "center" }}
          onPress={() => {
            Actions.Messages();
          }}
        >
          <Icon name="mail" />
        </TouchableOpacity>
      );
    } else {
      return null;
    }
  };

  render() {
    return (
      <Router>
        <Scene key="root">
          <Scene
            renderRightButton={this.renderRightButton}
            renderLeftButton={this.renderLeftButton}
            key="Lobby"
            type="refresh"
            ee={ee}
            component={Lobby}
            title="Lobby"
          />
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
          <Scene
            direction="leftToRight"
            key="Settings"
            ee={ee}
            component={Settings}
            title="Settings"
          />
        </Scene>
      </Router>
    );
  }
}
