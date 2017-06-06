import React, { Component } from 'react';
import { FlatList, RefreshControl } from 'react-native';
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
} from 'native-base';

import EventEmitter from 'react-native-eventemitter';
import { getLobby } from './../api/requests';
const defaultImage = require('./../images/dt.png');

export default class Lobby extends Component {
	constructor(props) {
		super(props);
		this.query = '';
		this.state = {
			rooms: [],
			refreshing: false
		};
	}

	componentWillMount() {
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
		this.refs.search._root.setNativeProps({ text: '' });
		this.query = '';
		this.getLobby();
	}

	pressRow(item) {
		console.log(this);
		// this.props.navigation.navigate('Room', {
		// 	name: item.name,
		// 	roomID: item._id
		// });
		EventEmitter.emit('joinRoom', item);
	}

	renderItem({ item }) {
		return (
			<ListItem onPress={() => this.pressRow(item)}>
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
							: 'No one is playing'}
					</Text>
				</Body>
			</ListItem>
		);
	}

	render() {
		return (
			<Container>
				<Header searchBar rounded>
					<Item>
						<Icon
							onPress={this.clearSearch.bind(this)}
							name="close"
						/>
						<Input
							ref="search"
							placeholder="Search rooms"
							placeholderTextColor={'black'}
							returnKeyType="search"
							returnKeyLabel="search"
							autoCapitalize="none"
							autoCorrect={false}
							onChangeText={search => (this.query = search)}
							onSubmitEditing={() => this.getLobby(this.query)}
						/>
					</Item>
				</Header>
				<FlatList
					refreshControl={
						<RefreshControl
							refreshing={this.state.refreshing}
							onRefresh={this._onRefresh.bind(this)}
						/>
					}
					data={this.state.rooms}
					keyExtractor={item => item._id}
					renderItem={this.renderItem.bind(this)}
				/>
			</Container>
		);
	}
}

const styles = {
	textCenter: {
		justifyContent: 'center',
		textAlign: 'center'
	}
};
