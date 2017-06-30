import React, { Component } from "react";
import {
  ListItem,
  Item,
  Left,
  Body,
  Right,
  Thumbnail,
  Text,
  Icon,
  Container,
  Input
} from "native-base";
import {
  View,
  FlatList,
  AsyncStorage,
  KeyboardAvoidingView
} from "react-native";
import { getUserAvatar, getUserInfo, chat } from "./../../api/requests";
import Autolink from "react-native-autolink";
import KeyboardSpacer from "react-native-keyboard-spacer";

export default class Playlists extends Component {
  constructor(props) {
    super(props);
    this.mounted = false;
    this.state = {
      messages: []
    };

    this.chatMessage = "";

    this.props.ee.addListener("chat", msg => {
      if (this.mounted) {
        getUserInfo(msg.user._id).then(user => {
          msg.avatar = user.profileImage.secure_url;
          msg.humanTime = new Date(msg.time).toLocaleTimeString();
          this.setState(previousState => ({
            messages: [msg, ...previousState.messages]
          }));
        });
      }
      // } else {
      //   getUserInfo(msg.user._id).then(user => {
      //     msg.avatar = user.profileImage.secure_url;
      //     msg.humanTime = new Date(msg.time).toLocaleTimeString();
      //     AsyncStorage.getItem("messages").then(messages => {
      //       msgs = JSON.parse(messages);
      //       msgs.unshift(msg);
      //       AsyncStorage.setItem("messages", JSON.stringify(msgs));
      //     });
      //   });
      // }
    });
  }

  componentWillMount() {
    this.mounted = true;
    // console.log(this.props.old);
    // if (this.props.oldMessages) {
    //   AsyncStorage.getItem("messages").then(messages => {
    //     console.log("old", messages);
    //     this.setState({ messages: JSON.parse(messages) });
    //   });
    // } else {
    //   console.log("new");
    //   AsyncStorage.removeItem("messages");
    // }
  }

  componentWillUnmount() {
    this.mounted = false;
    let messages = JSON.stringify(this.state.messages);
    AsyncStorage.setItem("messages", messages);
  }

  onSend() {
    let room = this.props.room;
    chat(this.chatMessage, room._id, room.realTimeChannel).then(() => {
      this.chatMessage = "";
      this._chat._root.clear();
    });
  }

  renderMessage({ item }) {
    return (
      <ListItem
        avatar
        key={item._id}
        style={{
          transform: [{ scaleY: -1 }],
          borderWidth: 0,
          borderBottomWidth: 0
        }}
      >
        <Left>
          <Thumbnail small source={{ uri: item.avatar }} />
        </Left>
        <Body>
          <Text note>{item.user.username}</Text>
          <Autolink stripPrefix={false} text={item.message} />
        </Body>
        <Right>
          <Text note>{item.humanTime}</Text>
        </Right>
      </ListItem>
    );
  }

  render() {
    return (
      <Container>
        <FlatList
          style={{
            transform: [{ scaleY: -1 }]
          }}
          data={this.state.messages}
          keyExtractor={item => item._id}
          renderItem={this.renderMessage.bind(this)}
        />
        {this.props.user
          ? <Item
              style={{
                borderBottomWidth: 0
              }}
            >
              <Input
                ref={chat => {
                  this._chat = chat;
                }}
                style={{
                  paddingLeft: 20
                }}
                onChangeText={message => (this.chatMessage = message)}
                onSubmitEditing={this.onSend.bind(this)}
                returnKeyType="send"
                placeholder="Send a message ..."
              />
            </Item>
          : <Item
              disabled
              style={{
                borderBottomWidth: 0
              }}
            >
              <Input
                ref={chat => {
                  this._chat = chat;
                }}
                style={{
                  paddingLeft: 20
                }}
                placeholder="Log in to join the chatroom"
              />
            </Item>}
        <KeyboardSpacer />

      </Container>
    );
  }
}
