import React, { Component } from "react";
import {
  View,
  Text,
  Alert,
  AsyncStorage,
  WebView,
  Linking
} from "react-native";
import { Thumbnail, Button, Icon } from "native-base";
import Drawer from "react-native-drawer";
import { Actions, DefaultRenderer } from "react-native-router-flux";
import { logout, joinRoom } from "./api/requests";

class DrawerNav extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null
    };

    this.ee = this.props.ee;

    this.ee.addListener("login", user => {
      this.setState({ user });
    });
  }

  logout() {
    this.ee.emit("logout");
    logout();
    Actions.refresh({
      type: "reset"
    });
    this.setState({ user: null });
  }

  componentWillMount() {
    AsyncStorage.getItem("user").then(user => {
      if (user) {
        let info = JSON.parse(user);
        this.setState({ user: info });
      }
    });
  }

  componentDidMount() {}

  getSideMenu() {
    let user = this.state.user;
    return (
      <View style={styles.drawerContainer}>
        {user
          ? <Button style={{ marginBottom: 20 }} iconLeft block transparent>
              <Thumbnail small source={{ uri: user.profileImage.secure_url }} />
              <Text> {user.username} </Text>
            </Button>
          : null}
        <Button
          iconLeft
          block
          transparent
          onPress={() => {
            this._drawer.close();
            Actions.Lobby({ type: "reset" });
          }}
        >
          <Icon name="apps" />
          <Text> Lobby </Text>
        </Button>
        {user
          ? <Button
              iconLeft
              block
              transparent
              onPress={() => {
                this._drawer.close();
                Actions.Messages({ type: "reset" });
              }}
            >
              <Icon name="mail" />
              <Text> Messages </Text>
            </Button>
          : null}
        {user
          ? <Button
              iconLeft
              block
              transparent
              onPress={() => {
                Alert.alert("Logout?", null, [
                  { text: "Cancel" },
                  {
                    text: "Logout",
                    onPress: () => {
                      this._drawer.close();
                      this.logout();
                    }
                  }
                ]);
              }}
            >
              <Icon name="log-out" />
              <Text> Log Out </Text>
            </Button>
          : <Button
              iconLeft
              block
              transparent
              onPress={() => {
                this._drawer.close();
                Actions.Login();
              }}
            >
              <Icon name="log-in" />
              <Text> Log In </Text>
            </Button>}
        {user
          ? null
          : <Button
              iconLeft
              transparent
              block
              onPress={() => {
                Linking.openURL("https://www.dubtrack.fm/signup");
              }}
            >
              <Icon name="person-add" />
              <Text> Sign Up </Text>
            </Button>}
        <Button block transparent style={{ marginTop: 60 }}>
          <Text style={{ fontWeight: "bold" }}>
            Donate or Support
          </Text>
        </Button>
        <Button
          iconLeft
          transparent
          block
          onPress={() => {
            Linking.openURL("https://paypal.me/chrissbendel");
          }}
        >
          <Icon name="cash" />
          <Text note>Buy me a coffee</Text>
        </Button>
      </View>
    );
  }

  render() {
    const SideMenu = this.getSideMenu();
    const state = this.props.navigationState;
    const children = state.children;

    return (
      <Drawer
        ref={ref => (this._drawer = ref)}
        open={state.open}
        type="static"
        content={SideMenu}
        tapToClose={true}
        openDrawerOffset={0.5}
        panOpenMask={0.2}
        panCloseMask={0.4}
        panThreshold={0.5}
        negotiatePan={true}
        tweenDuration={100}
        tweenHandler={ratio => ({
          main: { opacity: Math.max(0.54, 1 - ratio) },
          mainOverlay: { width: 0, height: 0 }
        })}
      >
        <DefaultRenderer
          navigationState={children[0]}
          onNavigate={this.props.onNavigate}
        />
      </Drawer>
    );
  }
}

const styles = {
  drawerContainer: {
    justifyContent: "center",
    flex: 1
  },
  center: {
    justifyContent: "center",
    alignItems: "center"
  }
};

export default DrawerNav;
