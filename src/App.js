import React, { Component } from "react";
import { Icon, Button, Image, Text } from "native-base";
import { View, TouchableOpacity, AsyncStorage } from "react-native";

import { createNavigator } from "./Router";
import Lobby from "./components/Lobby";
import PrivateMessages from "./components/PrivateMessages";

export default class App extends Component {
  state = {
    loggedIn: Boolean,
    user: Object
  };

  constructor(props) {
    super(props);
    this.state = { loggedIn: false, user: null };
  }

  componentWillMount() {
    AsyncStorage.getItem("user").then(user => {
      if (user) {
        this.setState({ loggedIn: true, user: user });
        user = JSON.parse(user);
      } else {
        this.setState({ loggedIn: false, user: {} });
      }
    });
  }

  render() {
    let Layout = createNavigator(this.state.loggedIn, this.state.user);
    return <Layout />;
  }
}
