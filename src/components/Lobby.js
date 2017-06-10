import React, { Component } from "react";
import { RefreshControl, FlatList } from "react-native";
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
import { AdMobBanner } from "react-native-admob";

import { getLobby, joinRoom, token } from "./../api/requests";
import { Actions } from "react-native-router-flux";

const defaultImage = require("./../images/dt.png");

export default class Lobby extends Component {
	constructor(props) {
		super(props);
		this.query = "";
		this.state = {
			rooms: ["test"],
			refreshing: false
		};
		this.ee = this.props.ee;
	}

	componentWillMount() {
		this.getLobby();
	}

	componentWillReceiveProps() {
		this.getLobby();
	}

	getLobby(room = null) {
		this.setState({ refreshing: true });
		getLobby(room).then(rooms => {
			this.setState({ rooms: rooms, refreshing: false });
		});
	}

	_onRefresh() {
		this.getLobby();
		this.clearSearch();
	}

	clearSearch() {
		this.refs.search._root.setNativeProps({ text: "" });
		this.query = "";
		this.getLobby();
	}

	pressRow(item) {
		this.ee.emit("joinRoom", item);
		joinRoom(item._id).then(() => {
			Actions.Room({ room: item, title: item.name });
		});
	}

	renderItem({ item }) {
		return (
			<ListItem key={item._id} onPress={() => this.pressRow(item)}>
				<Thumbnail
					size={60}
					source={
						item.background
							? { uri: item.background.secure_url }
							: defaultImage
					}
				/>
				<Body>
					<Text style={styles.textCenter} numberOfLines={1}>
						{item.name}
					</Text>
					<Text style={styles.textCenter} numberOfLines={2} note>
						{item.currentSong
							? item.currentSong.name
							: "No one is playing"}
					</Text>
				</Body>
			</ListItem>
		);
	}

	render() {
		return (
			<Container style={{ marginTop: 50 }}>
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
						<Icon
							onPress={this.clearSearch.bind(this)}
							name="close"
						/>
					</Item>
				</Header>
				<AdMobBanner
					bannerSize="fullBanner"
					adUnitID="ca-app-pub-7092420459681661/2210957236"
					testDeviceID="EMULATOR"
				/>
				<FlatList
					removeClippedSubviews={false}
					initialNumToRender={this.state.rooms.length}
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
