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
	Image,
	Footer,
	Text,
	Input,
	Item,
	ListItem,
	Thumbnail,
	Container,
	Content
} from "native-base";
import {
	View,
	TouchableOpacity,
	AsyncStorage,
	Platform,
	ScrollView,
	FlatList,
	Alert
} from "react-native";
import { navigationOptions } from "react-navigation";
import { getUserAvatar, chat } from "./../api/requests";
import KeyboardSpacer from "react-native-keyboard-spacer";
import Autolink from "react-native-autolink";

export default class Room extends Component {
	constructor(props) {
		super(props);
		this.mounted = false;
		this.state = {
			messages: [],
			room: this.props.room
		};
		this.chatMessage = "";
		this.ee = this.props.ee;
		this.ee.addListener("chat", msg => {
			console.log(msg);
			if (this.mounted) {
				getUserAvatar(msg.user._id).then(url => {
					msg.avatar = url;
					msg.humanTime = new Date(msg.time).toLocaleTimeString();
					this.setState(previousState => ({
						messages: [msg, ...previousState.messages]
					}));
				});
			}
			//maybe else to store messages
		});
	}

	componentWillMount() {
		//maybe do auth session in here instead from api/requests
		//get room users here and load playlists and stuff with user info (Asyncstorage)
		AsyncStorage.getItem("user").then(user => {
			this.mounted = true;
			this.setState({ user: JSON.parse(user) });
		});
	}

	componentWillUnmount() {
		console.log("unmounting");
		this.mounted = false;
	}

	onSend() {
		let room = this.state.room;
		chat(this.chatMessage, room._id, room.realTimeChannel).then(() => {
			this.chatMessage = "";
			this._chat._root.clear();
		});
	}

	renderItem({ item }) {
		let key = item.time;
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

	render() {
		return (
			<Container>
				<Header />
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
									extraData={this.state}
									data={this.state.messages}
									keyExtractor={item => item.time}
									renderItem={this.renderItem.bind(this)}
								/>
							</View>
							<View style={{ flex: 1 }}>
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
										onChangeText={message =>
											(this.chatMessage = message)}
										onSubmitEditing={this.onSend.bind(this)}
										returnKeyType="send"
										placeholder="Send a message ..."
									/>
								</Item>
							</View>
							<KeyboardSpacer topSpacing={-25} />
						</View>
					</Tab>
					<Tab heading="Users" />
					<Tab heading="Playlists" />
				</Tabs>
			</Container>
		);
	}
}
