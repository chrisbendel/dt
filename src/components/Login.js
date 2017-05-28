import React, { Component } from "react";
import EventEmitter from "react-native-eventemitter";

import Logout from "./Views/LogoutView";
import Login from "./Views/LoginView";
import FullSpinner from "./Views/FullSpinnerView";
import { Container } from "native-base";
import { AsyncStorage } from "react-native";
import app from "./app";

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };

    this.auth = this.auth.bind(this);
    this.loading = this.loading.bind(this);
  }

  componentWillMount() {
    this.auth();
  }

  auth() {
    AsyncStorage.getItem("user").then(user => {
      this.loading(false);
      this.setState({ user: JSON.parse(user) });
      EventEmitter.emit("auth");
    });
  }

  loading(isloading = true) {
    isloading
      ? this.setState({ loading: true })
      : this.setState({ loading: false });
  }

  render() {
    return (
      <Container>
        {this.state.loading
          ? <FullSpinner />
          : this.state.user
              ? <Logout
                  name={this.state.user.username}
                  id={this.state.user._id}
                  avatar={this.state.user.profileImage.secure_url}
                  auth={this.auth}
                  loading={this.loading}
                />
              : <Login auth={this.auth} loading={this.loading} />}
      </Container>
    );
  }
}
