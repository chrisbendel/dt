/* @flow */

import React, { Component } from "react";
import { Icon, Button, Image, Text } from "native-base";
import { View, TouchableOpacity, AsyncStorage } from "react-native";
import {
  DrawerNavigator,
  StackNavigator,
  DrawerItems,
  navigationOptions
} from "react-navigation";
import Lobby from "./components/Lobby";
import PrivateMessages from "./components/PrivateMessages";

class DrawerView extends Component {
  constructor(props) {
    super(props);
    console.log(props);
  }

  componentWillMount() {
    AsyncStorage.getItem("user").then(user => {
      if (user) {
        user = JSON.parse(user);
        this.props.items = userRoutes;
      } else {
        this.props.items = userRoutes;
      }
    });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <DrawerItems {...this.props} />
      </View>
    );
  }
}

AsyncStorage.getItem("user").then(user => {
  if (user) {
    user = JSON.parse(user);
    // this.props.items = userRoutes;
    // this.setState({ loggedIn: true });
  } else {
    // this.props.items = userRoutes;
    // this.setState({ loggedIn: false });
  }
});

const userRoutes = {
  Lobby: {
    screen: Lobby,
    navigationOptions: {
      drawerLabel: "Lobby",
      title: "Lobby"
    }
  },
  PrivateMessages: {
    screen: PrivateMessages,
    navigationOptions: {
      drawerLabel: "Messages",
      title: "Messages"
    }
  }
};

const guestRoutes = {
  Lobby: {
    screen: Lobby,
    navigationOptions: {
      drawerLabel: "Lobby",
      title: "Lobby"
    }
  }
};

const Drawer = new DrawerNavigator(guestRoutes, {
  contentComponent: DrawerView,
  drawerWidth: 200
});

const AppNavigator = new StackNavigator(
  {
    Root: {
      screen: Drawer
    }
  },
  {
    navigationOptions: ({ navigation }) => ({
      headerLeft: (
        <View style={styles.drawerButton}>
          <TouchableOpacity
            onPress={() => {
              const { routes, index } = navigation.state;
              if (routes[index].routeName !== "DrawerClose") {
                navigation.navigate("DrawerClose");
              } else {
                navigation.navigate("DrawerOpen");
              }
            }}
          >
            <Icon name="menu" navigate={navigation.navigate} />
          </TouchableOpacity>
        </View>
      )
    })
  }
);

const styles = {
  drawerButton: {
    marginLeft: 30
  }
};

export default AppNavigator;
