import React, { Component } from 'react';
import {
  Container,
  Footer,
  Header,
  Icon,
  Button,
  Image,
  Text
} from 'native-base';
import { View, TouchableOpacity, AsyncStorage } from 'react-native';
import EventEmitter from 'react-native-eventemitter';

import Lobby from './components/Lobby';
import Socket from './api/socket';
import PrivateMessages from './components/PrivateMessages';
import PlayerContainer from './components/PlayerContainer';
import { Scene, Router } from 'react-native-router-flux';
import GuestDrawer from './GuestDrawer';
import UserDrawer from './UserDrawer';

console.disableYellowBox = true;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { loggedIn: false, user: null };
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
    if (this.state.user) {
      return (
        <Router>

          <Scene key="main" drawerIcon={<Icon name="menu" />}>
            <Scene
              key="drawer"
              user={this.state.user}
              component={this.state.user ? UserDrawer : GuestDrawer}
            >
              <Scene
                renderBackButton={null}
                key="Lobby"
                component={Lobby}
                title="Lobby"
              />
              <Scene
                renderBackButton={null}
                key="Messages"
                component={PrivateMessages}
                title="Messages"
              />
            </Scene>
          </Scene>
        </Router>
      );
    } else {
      return null;
    }
  }
}
