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
import { FlatList, AsyncStorage } from "react-native";
import { getConversation } from "./../api/requests";
import { Actions } from "react-native-router-flux";
import Autolink from "react-native-autolink";

export default class Conversation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: []
    };
    this.id = this.props.id;
  }

  list() {
    getConversation(this.id).then(messages => {
      console.log(messages.length);
      this.setState({ messages: messages });
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState)
    );
  }

  componentWillMount() {
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
        <FlatList
          ref={c => {
            this._messages = c;
          }}
          style={{ transform: [{ scaleY: -1 }] }}
          data={this.state.messages}
          keyExtractor={(item, index) => index}
          renderItem={this.renderItem.bind(this)}
        />
      </Container>
    );
  }
}
