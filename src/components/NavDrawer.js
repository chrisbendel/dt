/* @flow */

import React from "react";
import { Button, Platform, StyleSheet } from "react-native";
import { TabNavigator, DrawerNavigator } from "react-navigation";
import { Icon } from "native-base";
import requests from "./../api/requests";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Lobby from "./../components/Lobby";

const Nav = DrawerNavigator({
  Lobby: {
    screen: Lobby,
    navigationOptions: {
      drawer: () => ({
        label: "Lobby",
        icon: ({ tintColor }) => (
          <MaterialIcons
            name="filter-1"
            size={24}
            style={{ color: tintColor }}
          />
        )
      })
    }
  }
  // SimpleTabs: {
  //   screen: SimpleTabs,
  //   navigationOptions: {
  //     drawer: () => ({
  //       label: "Simple Tabs",
  //       icon: ({ tintColor }) => (
  //         <MaterialIcons
  //           name="filter-1"
  //           size={24}
  //           style={{ color: tintColor }}
  //         />
  //       )
  //     })
  //   }
  // },
  // StacksOverTabs: {
  //   screen: StacksOverTabs,
  //   navigationOptions: {
  //     drawer: () => ({
  //       label: "Stacks Over Tabs",
  //       icon: ({ tintColor }) => (
  //         <MaterialIcons
  //           name="filter-2"
  //           size={24}
  //           style={{ color: tintColor }}
  //         />
  //       )
  //     })
  //   }
  // }
});

export default Nav;
