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
import { FlatList, View, Alert } from "react-native";
import { playlist, playlists, addSong } from "./../../api/requests";

export default class Playlists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playlists: [],
      songs: null,
      name: null
    };
  }

  componentWillMount() {
    playlists(this.props.id).then(playlists => {
      this.setState({ playlists: playlists });
    });
  }

  renderPlaylistItem({ item }) {
    return (
      <ListItem
        icon
        key={item._id}
        onPress={() => {
          playlist(item._id).then(songs => {
            this.setState({ name: item.name, songs: songs });
          });
        }}
      >
        <Body>
          <Text>{item.name}</Text>
        </Body>
        <Right>
          <Text note>{item.totalItems}</Text>
          <Icon name="arrow-forward" />
        </Right>
      </ListItem>
    );
  }

  renderSong({ item }) {
    console.log(item);
    return (
      <ListItem
        avatar
        key={item._id}
        onPress={() => {
          Alert.alert("Queue this song?", null, [
            { text: "Cancel" },
            {
              text: "Queue Song",
              onPress: () => {
                addSong(this.props.id, item._song.fkid, item._song.type);
              }
            }
          ]);
        }}
      >
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
    if (this.state.songs) {
      return (
        <Container>
          <Header>
            <Left>
              <Button
                transparent
                onPress={() => {
                  this.setState({ songs: null });
                }}
              >
                <Icon name="arrow-back" />
              </Button>
            </Left>
            <Body>
              <Title>{this.state.name}</Title>
            </Body>
            <Right />
          </Header>
          <FlatList
            keyExtractor={item => item._id}
            data={this.state.songs}
            renderItem={this.renderSong.bind(this)}
          />
        </Container>
      );
    }

    return (
      <Container>
        <FlatList
          keyExtractor={item => item._id}
          data={this.state.playlists}
          renderItem={this.renderPlaylistItem.bind(this)}
        />
      </Container>
    );
  }
}
