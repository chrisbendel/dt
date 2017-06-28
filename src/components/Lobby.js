import React, { Component } from "react";
import { RefreshControl, FlatList, ScrollView, Platform } from "react-native";
import {
	Container,
	Header,
	Content,
	ListItem,
	Thumbnail,
	Footer,
	FooterTab,
	Button,
	Body,
	Item,
	Icon,
	Text,
	Input
} from "native-base";

import { getLobby, joinRoom, token } from "./../api/requests";
import { Actions } from "react-native-router-flux";
import YouTube from "react-native-youtube";

// const defaultImage = require("./../images/dt.png");
const defaultImage =
	"https://res.cloudinary.com/hhberclba/image/upload/v1464461630/user/default.png";

export default class Lobby extends Component {
	constructor(props) {
		super(props);
		this.query = "";
		this.state = {
			rooms: [],
			refreshing: false
		};
		this.ee = this.props.ee;
	}

	componentWillMount() {
		this.getLobby();
	}

	getLobby(room = null) {
		this.setState({ refreshing: true });
		getLobby(room).then(rooms => {
			rooms.forEach(room => {
				if (!room.background) {
					room.background = { secure_url: defaultImage };
				}
				if (!room.currentSong) {
					room.currentSong = { name: "Noone is playing" };
				}
			});
			this.setState({ rooms: rooms, refreshing: false });
		});
	}

	_onRefresh() {
		this.clearSearch();
	}

	clearSearch() {
		this.refs.search._root.setNativeProps({ text: "" });
		this.query = "";
		this.getLobby();
	}

	pressRow(item) {
		joinRoom(item._id).then(() => {
			Actions.Room({ room: item, title: item.name });
			this.ee.emit("joinRoom", item);
		});
	}

	renderItem({ item }) {
		return (
			<ListItem
				style={{ height: 80 }}
				key={item._id}
				onPress={() => this.pressRow(item)}
			>
				<Body>
					<Text style={styles.textCenter} numberOfLines={1}>
						{item.name}
					</Text>
					<Text style={styles.textCenter} numberOfLines={1} note>
						{item.currentSong.name}
					</Text>
					<Text style={styles.textCenter} numberOfLines={1} note>
						{item.activeUsers} people in room
					</Text>
				</Body>
			</ListItem>
		);
	}

	render() {
		return (
			<Container style={{ paddingTop: Platform.OS === "ios" ? 64 : 54 }}>
				<Header searchBar rounded>
					<Item
						style={{
							paddingLeft: 20,
							paddingRight: 5
						}}
					>
						<Input
							ref="search"
							placeholder="Search rooms"
							placeholderTextColor={"black"}
							returnKeyType="search"
							returnKeyLabel="search"
							autoCapitalize="none"
							autoCorrect={false}
							onChangeText={search => (this.query = search)}
							onSubmitEditing={() => this.getLobby(this.query)}
						/>
						<Icon onPress={this.clearSearch.bind(this)} name="refresh" />
					</Item>
				</Header>
				<FlatList
					getItemLayout={(data, index) => ({
						length: 100,
						offset: 100 * index,
						index
					})}
					removeClippedSubviews={false}
					initialNumToRender={20}
					disableVirtualization={false}
					refreshControl={
						<RefreshControl
							refreshing={this.state.refreshing}
							onRefresh={this._onRefresh.bind(this)}
						/>
					}
					data={this.state.rooms}
					keyExtractor={(item, index) => index}
					renderItem={this.renderItem.bind(this)}
				/>
			</Container>
		);
	}
}

const styles = {
	textCenter: {
		justifyContent: "center",
		textAlign: "center"
	}
};
