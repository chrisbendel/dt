import React, { Component } from "react";
import {
  Text,
  Dimensions,
  AsyncStorage,
  Alert,
  Linking,
  View
} from "react-native";
import {
  Container,
  Body,
  Button,
  Content,
  Form,
  Item,
  Input
} from "native-base";
import { Actions } from "react-native-router-flux";

import Loading from "./Loading";
import { login } from "./../api/requests";

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.ee = this.props.ee;

    this.state = {
      username: "",
      password: ""
    };
  }

  loading(isloading = true) {
    isloading
      ? this.setState({ loading: true })
      : this.setState({ loading: false });
  }

  render() {
    if (this.state.loading) {
      return <Loading />;
    }

    return (
      <Container>
        <Content>
          <Body style={styles.Body}>
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
                bordered
                onPress={() => {
                  this.loading();
                  login(this.state.username, this.state.password).then(res => {
                    console.log(res);
                    if (res.code) {
                      Alert.alert(
                        res.data.details.message ||
                          res.data.details.message.message
                      );
                      this.loading(false);
                    } else {
                      this.loading(false);
                      Actions.Lobby({
                        type: "reset"
                      });
                      this.ee.emit("login", res);
                    }
                  });
                }}
              >
                <Text>Log In</Text>
              </Button>
            </Form>

          </Body>
        </Content>
      </Container>
    );
  }
}

const { height, width } = Dimensions.get("window");
const styles = {
  Body: {
    flex: 1,
    marginTop: height / 4,
    justifyContent: "center",
    alignItems: "center"
  },
  Form: {
    width: 200
  },
  Box: {
    alignItems: "center"
  },
  pholder: {
    textAlign: "center"
  }
};
