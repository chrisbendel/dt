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
import EventEmitter from "EventEmitter";

import Lobby from "./components/Lobby";
import Room from "./components/Room";
import Login from "./components/Login";
import Socket from "./api/socket";
import Conversation from "./components/Conversation";
import PrivateMessages from "./components/PrivateMessages";
import { Scene, Router, Actions } from "react-native-router-flux";
import DrawerNav from "./DrawerNav";
import KeyboardSpacer from "react-native-keyboard-spacer";
import KeyboardSpace from "react-native-keyboard-space";

console.disableYellowBox = true;

const ee = new EventEmitter();

const scenes = Actions.create(
  <Scene key="main" type="reset">
    <Scene key="drawer" open={false} ee={ee} component={DrawerNav}>
      <Scene key="root" tabs={false} drawerIcon={<Icon name="menu" />}>
        <Scene
          key="Lobby"
          ee={ee}
          component={Lobby}
          title="Lobby"
          renderRightButton={() => {
            return <Icon name="menu" />;
          }}
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
        <Scene key="Login" ee={ee} component={Login} title="Log In" />
      </Scene>
    </Scene>
  </Scene>
);

export default class App extends Component {
  constructor(props) {
    super(props);
    this.socket = null;
    this.state = {
      room: null
    };

    ee.addListener("logout", () => {
      this.socket.close();
      this.socket = new Socket(ee);
    });

    ee.addListener("login", user => {
      this.socket.close();
      this.socket = new Socket(ee, user);
    });

    ee.addListener("joinRoom", room => {
      if (this.socket) {
        this.socket.close();
      }
      this.socket = new Socket(ee, this.state.user, room._id);
      this.setState({ room: room });
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
      <Container>
        <Router>
          <Scene key="main" type="reset">
            <Scene key="drawer" open={false} ee={ee} component={DrawerNav}>
              <Scene key="root" tabs={false} drawerIcon={<Icon name="menu" />}>
                <Scene
                  key="Lobby"
                  ee={ee}
                  component={Lobby}
                  title="Lobby"
                  renderRightButton={() => {
                    if (this.state.room) {
                      return (
                        <TouchableOpacity
                          onPress={() => {
                            Actions.Room({
                              room: this.state.room,
                              title: this.state.room.name,
                              old: true
                            });
                          }}
                        >
                          <Icon name="musical-notes" />
                        </TouchableOpacity>
                      );
                    }
                  }}
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
                <Scene key="Login" ee={ee} component={Login} title="Log In" />
              </Scene>
            </Scene>
          </Scene>
        </Router>
        <KeyboardSpace />
      </Container>
    );
  }
}
