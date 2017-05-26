/* @flow */

import React from "react";

import {
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  View
} from "react-native";
import { StackNavigator } from "react-navigation";

import NavDrawer from "./components/NavDrawer";
import Lobby from "./components/Lobby";

const Routes = {
  NavDrawer: {
    name: "Drawer",
    description: "Navigation",
    screen: NavDrawer
  }
};

const AppNavigator = StackNavigator(
  {
    ...Routes,
    Lobby: {
      screen: NavDrawer
    }
  },
  {
    initialRouteName: "Lobby",
    mode: Platform.OS === "ios" ? "modal" : "card"
  }
);

export default () => <AppNavigator />;
