import React, { Component } from "react";
import {
  Container,
  Content,
  Thumbnail,
  List,
  ListItem,
  Header,
  Body,
  Input,
  Title,
  Text,
  Left,
  Right
} from "native-base";
import { FlatList, AsyncStorage, View } from "react-native";
import { getConversation, sendPM } from "./../api/requests";
import { Actions } from "react-native-router-flux";
import Autolink from "react-native-autolink";
import KeyboardSpacer from "react-native-keyboard-spacer";

export default class Conversation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: []
    };
    this.chatMessage = "";
    this.id = this.props.id;
    this.ee = this.props.ee;

    this.ee.addListener("privateMessage", msg => {
      console.log(msg);
      this.list();
    });
  }

  list() {
    getConversation(this.id).then(messages => {
      messages.splice(50, 100);
      this.setState({ messages: messages });
    });
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return (
  //     !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState)
  //   );
  // }

  componentWillMount() {
    this.list();
  }

  onSend() {
    sendPM(this.id, this.chatMessage).then(res => {
      console.log(res);
      this.chatMessage = "";
      this._chat._root.clear();
    });
    this.list();
  }

  renderItem(item) {
    let message = item.item;
    return (
      <ListItem
        avatar
        style={{
          transform: [{ scaleY: -1 }],
          borderWidth: 0,
          borderBottomWidth: 0
        }}
      >
        <Left>
          <Thumbnail
            small
            source={{ uri: message._user.profileImage.secure_url }}
          />
        </Left>
        <Body>
          <Text note>{message._user.username}</Text>
          <Autolink stripPrefix={false} text={message.message} />
        </Body>
        <Right>
          <Text note>{new Date(message.created).toLocaleDateString()}</Text>
        </Right>
      </ListItem>
    );
  }

  render() {
    return (
      <Container>
        <Header />
        <View
          style={{
            flex: 10,
            flexGrow: 1,
            flexDirection: "column",
            justifyContent: "space-around"
          }}
        >
          <View style={{ flex: 9 }}>
            <FlatList
              ref={c => {
                this._messages = c;
              }}
              style={{ transform: [{ scaleY: -1 }] }}
              data={this.state.messages}
              keyExtractor={(item, index) => index}
              renderItem={this.renderItem.bind(this)}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Input
              ref={chat => {
                this._chat = chat;
              }}
              style={{
                paddingLeft: 20,
                borderWidth: 0,
                borderBottomWidth: 0
              }}
              onChangeText={message => (this.chatMessage = message)}
              onSubmitEditing={this.onSend.bind(this)}
              returnKeyType="send"
              placeholder="Type a message..."
            />
          </View>
          <KeyboardSpacer topSpacing={-25} />

        </View>

      </Container>
    );
  }
}
