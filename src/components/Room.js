import EventEmitter from "react-native-eventemitter";

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

export default class Room extends Component {
	constructor(props) {
		super(props);
		this.state = {
			messages: [],
			room: this.props.room
		};
		this.chatMessage = "";

		EventEmitter.on("chat", msg => {
			getUserAvatar(msg.user._id).then(url => {
				msg.avatar = url;
				msg.humanTime = new Date(msg.time).toLocaleTimeString();
				this.setState(previousState => ({
					messages: [...previousState.messages, msg]
				}));
			});
			//maybe else to store messages
		});
	}

	componentWillMount() {
		//get room users here and load playlists and stuff with user info (Asyncstorage)
		AsyncStorage.getItem("user").then(user => {
			console.log(JSON.parse(user));
		});
	}

	onSend() {
		console.log(this.state.room);
		let room = this.state.room;
		chat(this.chatMessage, room._id, room.realTimeChannel).then(() => {
			this.chatMessage = "";
			this._chat._root.clear();
		});
	}

	renderItem({ item }) {
		let key = item.time + item.user.created;
		return (
			<ListItem
				avatar
				key={key}
				style={{ borderTopWidth: 0, borderBottomWidth: 0 }}
			>
				<Left>
					<Thumbnail small source={{ uri: item.avatar }} />
				</Left>
				<Body>
					<Text note>{item.user.username}</Text>
					<Text>{item.message}</Text>
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
						<View style={{ flex: 1, flexDirection: "column" }}>
							<View style={{ flex: 0.9 }}>
								<FlatList
									data={this.state.messages}
									keyExtractor={item => item.time}
									renderItem={this.renderItem.bind(this)}
								/>
							</View>
							<View style={{ flex: 0.1 }}>
								<Item style={{ flex: 1 }}>
									<Input
										ref={chat => {
											this._chat = chat;
										}}
										onChangeText={message =>
											(this.chatMessage = message)}
										onSubmitEditing={this.onSend.bind(this)}
										returnKeyType="send"
										placeholder="Send a message ..."
									/>
									<Button
										transparent
										onPress={this.onSend.bind(this)}
									>
										<Text>Send</Text>
									</Button>
								</Item>
							</View>
						</View>
						<KeyboardSpacer />
					</Tab>
					<Tab heading="Users" />
					<Tab heading="Playlists" />
				</Tabs>
			</Container>
		);
	}
}
