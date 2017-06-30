import React, { Component } from "react";
import {
	RefreshControl,
	FlatList,
	ScrollView,
	Platform,
	View,
	ListView
} from "react-native";
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

const defaultImage =
	"https://res.cloudinary.com/hhberclba/image/upload/v1464461630/user/default.png";

export default class Lobby extends Component {
	constructor(props) {
		super(props);
		this.query = "";
		const ds = new ListView.DataSource({
			rowHasChanged: (r1, r2) => r1 !== r2
		});

		this.state = {
			rooms: new ListView.DataSource({
				rowHasChanged: (r1, r2) => r1 !== r2
			}),
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
			this.setState({
				rooms: this.state.rooms.cloneWithRows(rooms),
				refreshing: false
			});
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

	// renderItem({ item }) {
	renderItem(item) {
		return (
			<ListItem style={{ height: 80 }} onPress={() => this.pressRow(item)}>
				{Platform.OS === "ios"
					? <Thumbnail source={{ uri: item.background.secure_url }} />
					: null}
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
				<Item style={{ alignItems: "center", justifyContent: "center" }}>
					<Input
						ref="search"
						placeholder="Search for a room"
						placeholderTextColor={"blue"}
						style={{ textAlign: "center" }}
						returnKeyType="search"
						returnKeyLabel="search"
						autoCapitalize="none"
						autoCorrect={false}
						onChangeText={search => (this.query = search)}
						onSubmitEditing={() => this.getLobby(this.query)}
					/>
					<Icon onPress={this.clearSearch.bind(this)} name="refresh" />
				</Item>

				<ListView
					removeClippedSubviews={false}
					refreshControl={
						<RefreshControl
							refreshing={this.state.refreshing}
							onRefresh={this._onRefresh.bind(this)}
						/>
					}
					dataSource={this.state.rooms}
					renderRow={this.renderItem.bind(this)}
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
