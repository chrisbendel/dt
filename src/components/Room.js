import React, { Component } from "react";
import {
	Icon,
	Header,
	Tabs,
	Tab,
	Left,
	Body,
	Right,
	Button,
	Footer,
	Text,
	Input,
	Item,
	TabHeading,
	ListItem,
	Thumbnail,
	Container,
	Content
} from "native-base";
import { View, AsyncStorage, RefreshControl, FlatList } from "react-native";
import { getUserAvatar, chat, getRoomUsers } from "./../api/requests";
import KeyboardSpacer from "react-native-keyboard-spacer";
import Autolink from "react-native-autolink";
import { AdMobBanner } from "react-native-admob";

const defaultImage =
	"https://res.cloudinary.com/hhberclba/image/upload/v1464461630/user/default.png";

export default class Room extends Component {
	constructor(props) {
		super(props);
		this.mounted = false;
		this.state = {
			messages: [],
			refreshing: false,
			user: null
		};

		this.chatMessage = "";
		this.ee = this.props.ee;

		this.ee.addListener("chat", msg => {
			if (this.mounted) {
				getUserAvatar(msg.user._id).then(url => {
					msg.avatar = url;
					msg.humanTime = new Date(msg.time).toLocaleTimeString();
					this.setState(previousState => ({
						messages: [msg, ...previousState.messages]
					}));
				});
			} else {
				getUserAvatar(msg.user._id).then(url => {
					msg.avatar = url;
					msg.humanTime = new Date(msg.time).toLocaleTimeString();
					AsyncStorage.getItem("messages").then(messages => {
						msgs = JSON.parse(messages);
						msgs.unshift(msg);
						AsyncStorage.setItem("messages", JSON.stringify(msgs));
					});
				});
			}
		});

		this.ee.addListener("userJoin", msg => {
			if (this.mounted) {
				getRoomUsers(this.props.room._id).then(users => {
					this.setState({ users: users });
				});
			}
		});
	}

	componentWillMount() {
		this.mounted = true;
		// holy logic
		AsyncStorage.getAllKeys((err, keys) => {
			AsyncStorage.multiGet(keys, (err, stores) => {
				stores.map((result, i, store) => {
					let key = store[i][0];
					let value = store[i][1];
				});
				let messages, user, roomID;
				for (key in stores) {
					let k = stores[key][0];
					let v = stores[key][1];
					switch (k) {
						case "roomID":
							roomID = v;
							break;
						case "messages":
							messages = JSON.parse(v);
							break;
						case "user":
							user = JSON.parse(v);
							break;
					}
					if (roomID == this.props.room._id) {
						getRoomUsers(this.props.room._id).then(users => {
							this.setState({
								user: user,
								users: users,
								messages: messages
							});
						});
					} else {
						getRoomUsers(this.props.room._id).then(users => {
							this.setState({
								user: user,
								users: users,
								messages: []
							});
						});
					}
				}
			});
		});
	}

	_onRefresh() {
		getRoomUsers(this.props.room._id).then(users => {
			this.setState({ users: users });
		});
	}

	componentWillUnmount() {
		console.log("unmounting");
		this.mounted = false;
		let messages = JSON.stringify(this.state.messages);
		AsyncStorage.multiSet([
			["messages", messages],
			["roomID", this.props.room._id]
		]);
	}

	onSend() {
		let room = this.props.room;
		chat(this.chatMessage, room._id, room.realTimeChannel).then(() => {
			this.chatMessage = "";
			this._chat._root.clear();
		});
	}

	renderMessage({ item }) {
		let key = item._id;
		return (
			<ListItem
				avatar
				key={key}
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

	renderUser({ item }) {
		let key = item._id;
		return (
			<ListItem key={key} avatar>
				<Left>
					<Thumbnail
						small
						source={{
							uri: item._user.profileImage
								? item._user.profileImage.secure_url
								: defaultImage
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
			<Container>
				<Header />
				<AdMobBanner
					bannerSize="fullBanner"
					adUnitID="ca-app-pub-7092420459681661/9298415230"
				/>
				<Tabs>
					<Tab heading="Chat">
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
										this._chatroom = c;
									}}
									style={{
										transform: [{ scaleY: -1 }]
									}}
									data={this.state.messages}
									// keyExtractor={item => item._id}
									renderItem={this.renderMessage}
								/>
							</View>
							{this.state.user
								? <View style={{ flex: 1 }}>
										<Item
											style={{
												borderWidth: 0,
												borderBottomWidth: 0
											}}
										>
											<Input
												ref={chat => {
													this._chat = chat;
												}}
												style={{
													paddingLeft: 20,
													borderWidth: 0,
													borderBottomWidth: 0
												}}
												autoFocus={true}
												onChangeText={message =>
													(this.chatMessage = message)}
												onSubmitEditing={this.onSend.bind(
													this
												)}
												returnKeyType="send"
												placeholder="Send a message ..."
											/>
										</Item>
										<KeyboardSpacer topSpacing={-25} />
									</View>
								: null}
						</View>
					</Tab>
					<Tab heading="Users">
						<FlatList
							ref={c => {
								this._users = c;
							}}
							refreshControl={
								<RefreshControl
									refreshing={this.state.refreshing}
									onRefresh={this._onRefresh.bind(this)}
								/>
							}
							data={this.state.users}
							// keyExtractor={item => item._id}
							renderItem={this.renderUser}
						/>
					</Tab>
					{this.state.user ? <Tab heading="Playlists" /> : null}
				</Tabs>
			</Container>
		);
	}
}
