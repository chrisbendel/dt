import React, { Component } from "react";
import {
  Header,
  ListItem,
  Button,
  Left,
  Body,
  Title,
  Right,
  Thumbnail,
  Container,
  Text,
  Icon
} from "native-base";
import { FlatList, Modal } from "react-native";
import { playlist } from "./../../api/requests";

export default class Playlist extends Component {
  constructor(props) {
    super(props);
  }

  renderItem({ item }) {
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
      <Modal
        animationType={"fade"}
        transparent={true}
        visible={this.props.visible}
      >
        <Container>
          <Header>
            <Left />
            <Body>
              <Title>{this.props.name}</Title>
            </Body>
            <Right>
              <Button
                transparent
                onPress={() => {
                  this.props.setVisible(false);
                }}
              >
                <Icon name="close" />
              </Button>
            </Right>
          </Header>

          <FlatList
            keyExtractor={item => item._id}
            data={this.props.songs}
            renderItem={this.renderItem.bind(this)}
          />
        </Container>
      </Modal>
    );
  }
}
