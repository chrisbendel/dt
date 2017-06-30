import React, { Component } from "react";
import { ListItem, Left, Body, Right, Text, Icon } from "native-base";
import { FlatList } from "react-native";
import { playlist } from "./../../api/requests";

export default class Playlist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      songs: []
    };
  }

  componentWillMount() {
    playlist(this.props.id).then(songs => {
      this.setState({ songs: songs });
    });
  }

  renderItem({ item }) {
    console.log(item);
    return (
      <ListItem icon key={item._id}>
        <Body>
          <Text>{item.name}</Text>
        </Body>
        <Right>
          <Icon name="arrow-forward" />
        </Right>
      </ListItem>
    );
  }

  render() {
    return <FlatList data={this.state.songs} renderItem={this.renderITem} />;
  }
}
