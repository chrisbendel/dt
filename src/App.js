import React, { Component } from 'react';
import { Container, Footer, Icon, Button, Image, Text } from 'native-base';
import { View, TouchableOpacity, AsyncStorage } from 'react-native';
import EventEmitter from 'react-native-eventemitter';

import { createNavigator } from './Router';
import Lobby from './components/Lobby';
import Socket from './api/socket';
import PrivateMessages from './components/PrivateMessages';
import PlayerContainer from './components/PlayerContainer';

console.disableYellowBox = true;

export default class App extends Component {
  state = {
    loggedIn: Boolean,
    user: Object
  };

  constructor(props) {
    super(props);
    this.state = { loggedIn: false, user: {} };
    EventEmitter.on('login', user => {
      this.setState({ loggedIn: true, user: user });
    });

    EventEmitter.on('logout', () => {
      this.setState({ loggedIn: false, user: {} });
    });
  }

  componentWillMount() {
    AsyncStorage.getItem('user').then(user => {
      if (user) {
        let info = JSON.parse(user);
        this.socket = new Socket(info._id);
        this.setState({ loggedIn: true, user: info });
      } else {
        this.socket = new Socket();
        this.setState({ loggedIn: false, user: {} });
      }
    });
  }

  render() {
    let Layout = createNavigator(this.state.loggedIn, this.state.user);
    return (
      <Container>
        <Layout />
        <PlayerContainer />
      </Container>
    );
  }
}
