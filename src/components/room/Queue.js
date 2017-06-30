import React, { Component } from "react";
import {
  Container,
  ListItem,
  Header,
  Left,
  Body,
  Right,
  Text,
  Thumbnail,
  Button,
  Title,
  Icon
} from "native-base";
import { FlatList, View } from "react-native";
import { roomQueue } from "./../../api/requests";

export default class Playlists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      songs: []
    };
  }

  componentWillMount() {
    roomQueue(this.props.id).then(songs => {
      this.setState({ songs: songs });
    });
  }

  renderSong({ item }) {
    return (
      <ListItem avatar key={item._id}>
        <Left>
          <Thumbnail small source={{ uri: item._song.images.thumbnail }} />
        </Left>
        <Body>
          <Text numberOfLines={1} note>{item._song.name}</Text>
        </Body>
      </ListItem>
    );
  }

  render() {
    return (
      <Container>
        <FlatList
          keyExtractor={item => item._id}
          data={this.state.songs}
          renderItem={this.renderSong.bind(this)}
        />
      </Container>
    );
  }
}
