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

console.disableYellowBox = true;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { loggedIn: false, user: null, room: null };
    // this.socket = ();
    console.log("constructor called in rerender!?!?");
    EventEmitter.on("login", user => {
      // this.socket = new Socket(user._id);
      this.setState({ user: user });
    });

    EventEmitter.on("logout", () => {
      // this.socket = new Socket();
      this.setState({ user: null });
    });

    EventEmitter.on("joinRoom", room => {
      // if (this.state.user) {
      //   this.socket = new Socket(this.state.user._id);
      // } else {
      //   this.socket = new Socket();
      // }
      this.setState({ room: room });
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
    let user = this.state.user;
    let room = this.state.room;
    this.socket = new Socket(user, room);
    return (
      <Container>
        <Router key={user ? user._id : "guest"}>
          <Scene
            key="drawer"
            open={false}
            gestureResponseDistance={200}
            room={room}
            user={user}
            component={user ? UserDrawer : GuestDrawer}
          >
            <Scene key="root" tabs={false} drawerIcon={<Icon name="menu" />}>
              <Scene key="Lobby" component={Lobby} title="Lobby" />
              <Scene key="Room" component={Room} title="Room" />
              <Scene
                key="Messages"
                component={PrivateMessages}
                title="Messages"
              />
              <Scene key="Login" component={Login} title="Login" />
            </Scene>
          </Scene>
        </Router>
        <PlayerContainer room={room} />
      </Container>
    );
  }
}
