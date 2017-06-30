import React, { Component } from "react";
import {
  Dimensions,
  AsyncStorage,
  Alert,
  Linking,
  Platform,
  View
} from "react-native";
import {
  Container,
  Body,
  Button,
  Content,
  Form,
  Icon,
  Item,
  Text,
  Thumbnail,
  Input
} from "native-base";
import { Actions, ActionConst } from "react-native-router-flux";

import Loading from "./Loading";
import { login, logout } from "./../api/requests";
import KeyboardSpacer from "react-native-keyboard-spacer";

export default class Settings extends Component {
  constructor(props) {
    super(props);

    this.ee = this.props.ee;

    this.state = {
      username: "",
      password: "",
      user: null,
      loading: true
    };
  }

  componentWillMount() {
    AsyncStorage.getItem("user").then(user => {
      this.setState({ user: JSON.parse(user), loading: false });
    });
  }

  logout() {
    this.setState({ loading: true });
    logout().then(() => {
      this.ee.emit("logout");
      this.setState({ loading: false });
      Actions.Lobby({ type: ActionConst.RESET });
    });
  }

  login() {
    this.setState({ loading: true });
    login(this.state.username, this.state.password).then(res => {
      if (res.code) {
        Alert.alert(
          res.data.details.message || res.data.details.message.message
        );
      } else {
        this.ee.emit("login", res);
        this.setState({ loading: false });
        Actions.Lobby({ type: ActionConst.RESET });
      }
    });
  }

  render() {
    if (this.state.loading) {
      return <Loading />;
    }

    if (this.state.user) {
      return (
        <Container style={styles.container}>
          <Form style={styles.Form}>
            <View style={{ marginBottom: 50, alignItems: "center" }}>
              <Thumbnail
                large
                source={{ uri: this.state.user.profileImage.secure_url }}
              />
              <Text> {this.state.user.username} </Text>
            </View>
            <Button
              block
              bordered
              onPress={() => {
                Alert.alert("Logout?", null, [
                  { text: "Cancel" },
                  {
                    text: "Logout",
                    onPress: () => {
                      this.logout();
                    }
                  }
                ]);
              }}
            >
              <Text>Log Out</Text>
            </Button>
            <Button
              block
              info
              style={{ marginTop: 60 }}
              onPress={() => {
                Linking.openURL("https://paypal.me/chrissbendel");
              }}
            >
              <Text style={{ fontSize: 12 }}>Donations Appreciated!</Text>
            </Button>
          </Form>
        </Container>
      );
    } else {
      return (
        <Container style={styles.container}>
          <Form style={styles.Form}>
            <Item style={styles.Box}>
              <Input
                autoCorrect={false}
                autoCapitalize="none"
                returnKeyType="done"
                returnKeyLabel="done"
                onChangeText={username => this.setState({ username })}
                style={styles.pholder}
                placeholder="Username"
              />
            </Item>
            <Item last style={styles.Box}>
              <Input
                autoCorrect={false}
                autoCapitalize="none"
                returnKeyType="done"
                returnKeyLabel="done"
                secureTextEntry={true}
                onChangeText={password => this.setState({ password })}
                style={styles.pholder}
                placeholder="Password"
              />
            </Item>
            <Button
              block
              info
              onPress={() => {
                this.login();
              }}
            >
              <Text>Log In</Text>
            </Button>
            <Button
              block
              primary
              bordered
              style={{ marginTop: 60 }}
              onPress={() => {
                Linking.openURL("https://paypal.me/chrissbendel");
              }}
            >
              <Text style={{ fontSize: 12 }}>Donations Appreciated!</Text>
            </Button>
          </Form>
        </Container>
      );
    }
  }
}

const { height, width } = Dimensions.get("window");
const styles = {
  container: {
    marginTop: Platform.OS === "ios" ? 64 : 54,
    alignItems: "center",
    justifyContent: "center"
  },
  Form: {
    width: 200,
    alignItems: "center",
    justifyContent: "center"
  },
  Box: {
    alignItems: "center"
  },
  pholder: {
    textAlign: "center"
  }
};
