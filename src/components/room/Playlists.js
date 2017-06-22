import React, { Component } from "react";
import { ListItem, Left, Body, Right, Text, Icon } from "native-base";
import { FlatList } from "react-native";
import { playlist, playlists } from "./../../api/requests";

export default class Playlists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playlists: []
    };
  }

  componentWillMount() {
    playlists(this.props.id).then(playlists => {
      this.setState({ playlists: playlists });
      console.log(playlists);
    });
  }

  renderPlaylistItem({ item }) {
    return (
      <ListItem icon key={item._id}>
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

  render() {
    return (
      <FlatList
        data={this.state.playlists}
        renderItem={this.renderPlaylistItem}
      />
    );
  }
}
