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
import Room from './components/Room';
import Login from './components/Login';

import Socket from './api/socket';
import PrivateMessages from './components/PrivateMessages';
import PlayerContainer from './components/PlayerContainer';
import { Scene, Router, Actions } from 'react-native-router-flux';
import GuestDrawer from './GuestDrawer';
import UserDrawer from './UserDrawer';

console.disableYellowBox = true;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { loggedIn: false, user: null };
    EventEmitter.on('login', user => {
      this.socket = new Socket(user._id);
      this.setState({ user: user });
      // Actions.user({ user: user });
    });

    EventEmitter.on('logout', () => {
      this.socket = new Socket();
      this.setState({ user: null });
      // Actions.guest({ user: null });
    });
  }

  componentWillMount() {
    AsyncStorage.getItem('user').then(user => {
      if (user) {
        let info = JSON.parse(user);
        console.log(info);
        this.socket = new Socket(info._id);
        this.setState({ user: info });
        // Actions.user({ user: info });
      } else {
        this.socket = new Socket();
        this.setState({ user: null });
        // Actions.guest({ user: null });
      }
    });
  }

  render() {
    let user = this.state.user;
    return (
      <Router key={user ? user._id : 'guest'}>
        <Scene
          key="drawer"
          open={false}
          gestureResponseDistance={200}
          user={user}
          component={user ? UserDrawer : GuestDrawer}
        >
          <Scene key="root" tabs={false} drawerIcon={<Icon name="menu" />}>
            <Scene key="Lobby" component={Lobby} title="Lobby" />
            <Scene key="Room" component={Room} title="Room" />
            <Scene
              key="Messages"
              component={PrivateMessages}
              title="Messages"
            />
            <Scene key="Login" component={Login} title="Login" />
          </Scene>
        </Scene>
      </Router>
    );
  }
}
