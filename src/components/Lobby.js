import React, { Component } from "react";
import { FlatList } from "react-native";
import { ListItem, Thumbnail, Body, Text } from "native-base";
import { getLobby } from "./../api/requests";

const defaultImage = require("./../images/dt.png");

export default class Lobby extends Component {
	constructor(props) {
		super(props);

		this.state = {
			rooms: []
		};
	}

	componentDidMount() {
		this.getLobby();
	}

	getLobby(room = null) {
		getLobby(room).then(rooms => {
			this.setState({ rooms: rooms });
		});
	}

	renderItem = ({ item }) => {
		console.log(item);
		return (
			<ListItem>
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
	};

	render() {
		return (
			<FlatList
				data={this.state.rooms}
				keyExtractor={item => item._id}
				renderItem={this.renderItem.bind(this)}
			/>
		);
	}
}

const styles = {
	textCenter: {
		justifyContent: "center",
		textAlign: "center"
	}
};
