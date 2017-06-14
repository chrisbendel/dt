import React, { Component } from "react";
import {
  Container,
  Content,
  Thumbnail,
  List,
  ListItem,
  Header,
  Body,
  Title,
  Text,
  Left,
  Right
} from "native-base";
import { RefreshControl, FlatList, AsyncStorage } from "react-native";
import { getMessages, markAsRead } from "./../api/requests";
import { Actions } from "react-native-router-flux";

export default class Messages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      conversations: [],
      refreshing: false
    };
  }

  componentWillMount() {
    AsyncStorage.getItem("user").then(user => {
      user = JSON.parse(user);
      console.log(user);
      this.setState({ user: user });
      this.listMessages();
    });
  }

  listMessages() {
    this.setState({ refreshing: true });
    getMessages().then(conversations => {
      this.setState({
        conversations: conversations,
        refreshing: false
      });
    });
  }

  _onRefresh() {
    this.listMessages();
  }

  renderItem(item) {
    let conversation = item.item;
    console.log(conversation);
    let otherUser;
    conversation.usersid.forEach(user => {
      if (user._id !== this.state.user._id) {
        otherUser = user;
      }
    });
    return (
      <ListItem
        avatar
        onPress={() => {
          markAsRead(conversation._id).then(() => {
            Actions.Conversation({
              id: conversation._id,
              title: otherUser.username
            });
          });
        }}
      >
        <Left>
          <Thumbnail
            small
            source={{ uri: otherUser.profileImage.secure_url }}
          />
        </Left>
        <Body>
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>
            {otherUser.username}
          </Text>
          <Text numberOfLines={1} note>{conversation.latest_message_str}</Text>
        </Body>
        <Right>
          <Text note>
            {new Date(conversation.latest_message).toLocaleDateString()}
          </Text>
        </Right>
      </ListItem>
    );
  }

  render() {
    return (
      <Container>
        <Header />
        <FlatList
          removeClippedSubviews={false}
          initialNumToRender={this.state.conversations.length}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
          data={this.state.conversations}
          keyExtractor={(item, index) => index}
          renderItem={this.renderItem.bind(this)}
        />
      </Container>
    );
  }
}
