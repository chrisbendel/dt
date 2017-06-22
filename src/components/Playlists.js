import React, { Component } from "react";
import {
  Container,
  Footer,
  Header,
  Content,
  Icon,
  Button,
  Image,
  Text
} from "native-base";
import { View, TouchableOpacity, AsyncStorage } from "react-native";
import { playlist, playlists } from './../../api/requests';

export default class Playlists extends Component {
  constructor(props) {
    super(props);
    console.log(this.props);
  }

  componentWillMount() {

  }

  render() {
    return (
      <Text> Hello </Text>
    );
  }
}
