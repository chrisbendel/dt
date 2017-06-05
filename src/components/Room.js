import EventEmitter from 'react-native-eventemitter';

import React, { Component } from 'react';
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
} from 'native-base';
import {
	View,
	TouchableOpacity,
	AsyncStorage,
	Platform,
	ScrollView,
	FlatList,
	Alert
} from 'react-native';
import { navigationOptions } from 'react-navigation';
import { getUserAvatar } from './../api/requests';
import KeyboardSpacer from 'react-native-keyboard-spacer';

export default class Room extends Component {
	constructor(props) {
		super(props);

		this.state = {
			messages: [],
			roomID: this.props.navigation.state.params.room,
			mounted: false
		};

		EventEmitter.on('chat', msg => {
			getUserAvatar(msg.user._id).then(url => {
				msg.avatar = url;
				msg.humanTime = new Date(msg.time).toLocaleTimeString();
				this.setState(previousState => ({
					messages: [...previousState.messages, msg]
				}));
			});
		});
	}

	componentWillMount() {
		AsyncStorage.getItem('user').then(user => {
			console.log(user);
		});
		//get room users here and load playlists and stuff with user info (Asyncstorage)
		console.log(this.state);
	}

	renderItem({ item }) {
		return (
			<ListItem
				avatar
				key={item.time}
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
		if (this.state.roomID) {
			return (
				<Tabs>
					<Tab heading="Chat">
						<View style={{ flex: 1, flexDirection: 'column' }}>
							<View style={{ flex: 0.9 }}>
								<FlatList
									data={this.state.messages}
									keyExtractor={item => item.time}
									renderItem={this.renderItem.bind(this)}
								/>
							</View>
							<View style={{ flex: 0.1 }}>
								<Item style={{ flex: 1 }}>
									<Input placeholder="Message ..." />
								</Item>
							</View>
							<KeyboardSpacer topSpacing={-40} />

						</View>

					</Tab>
					<Tab heading="Users" />
					<Tab heading="Playlists" />
				</Tabs>
			);
		} else {
			return null;
		}
	}
}
