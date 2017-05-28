/* @flow */

import React, { Component } from "react";
import { Icon, Button, Image, Text } from "native-base";
import { View, TouchableOpacity, AsyncStorage } from "react-native";
import {
  DrawerNavigator,
  TabNavigator,
  StackNavigator,
  DrawerItems,
  NavigationActions,
  navigationOptions
} from "react-navigation";

import { createNavigator } from "./Router";
import Lobby from "./components/Lobby";
import PrivateMessages from "./components/PrivateMessages";

export default class App extends Component {
  // constructor(props) {
  //   super(props);
  //   console.log(props);
  // }

  // componentWillMount() {
  // AsyncStorage.getItem("user").then(user => {
  //   if (user) {
  //     console.log("user");
  //     user = JSON.parse(user);
  //     this.props.navigator.navigate("User");
  //   } else {
  //     console.log("no user");
  //     this.props.navigator.navigate("Guest");
  //   }
  // });
  // }

  render() {
    const Layout = createNavigator(false);
    return <Layout />;
  }
}
