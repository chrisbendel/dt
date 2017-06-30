import React, { Component } from "react";
import { ListItem, Thumbnail, Left, Body, Right, Text } from "native-base";
import { FlatList, RefreshControl } from "react-native";
import { getRoomUsers } from "./../../api/requests";
const defaultImage =
  "https://res.cloudinary.com/hhberclba/image/upload/v1464461630/user/default.png";

export default class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      refreshing: false
    };

    this.props.ee.addListener("userJoin", msg => {
      this.users(this.props.id);
    });
  }

  users(id) {
    getRoomUsers(id).then(users => {
      users.forEach(user => {
        if (!user._user.profileImage) {
          user._user.profileImage = { secure_url: defaultImage };
        }
      });
      this.setState({ users: users });
    });
  }
  componentWillMount() {
    this.users(this.props.id);
  }

  _onRefresh() {
    this.users(this.props.id);
  }

  renderUser({ item }) {
    return (
      <ListItem style={{ height: 50 }} key={item._id} avatar>
        <Left>
          <Thumbnail
            small
            source={{
              uri: item._user.profileImage.secure_url
            }}
          />
        </Left>
        <Body>
          <Text>{item._user.username}</Text>
        </Body>
      </ListItem>
    );
  }

  render() {
    return (
      <FlatList
        ref={c => {
          this._users = c;
        }}
        getItemLayout={(data, index) => ({
          length: 50,
          offset: 50 * index,
          index
        })}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }
        data={this.state.users}
        keyExtractor={item => item._id}
        renderItem={this.renderUser.bind(this)}
      />
    );
  }
}
