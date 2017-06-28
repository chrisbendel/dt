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
import { View, AsyncStorage, FlatList, Platform } from "react-native";
import { getUserAvatar, getUserInfo, chat } from "./../api/requests";
import Playlists from "./room/Playlists";
import Users from "./room/Users";
import Chat from "./room/Chat";
import Video from "./room/Video";
import Loading from "./Loading";
import YouTube from "react-native-youtube";

export default class Room extends Component {
	constructor(props) {
		super(props);
		this.state = {
			user: null,
			loading: true
		};

		this.ee = this.props.ee;
	}

	componentDidMount() {
		AsyncStorage.getItem("user").then(user => {
			this.setState({ user: JSON.parse(user), loading: false });
		});
	}

	render() {
		if (this.state.loading) {
			return null;
		}

		return (
			<Container style={{ marginTop: Platform.OS === "ios" ? 64 : 54 }}>
				<View>
					<Video room={this.props.room} ee={this.ee} />
				</View>
				<Tabs locked>
					<Tab heading="Chat">
						<Chat
							room={this.props.room}
							ee={this.ee}
							user={this.state.user}
						/>
					</Tab>
					<Tab heading="Users">
						<Users id={this.props.room._id} ee={this.ee} />
					</Tab>
					{this.state.user
						? <Tab heading="Playlists">
								<Playlists id={this.props.room._id} />
							</Tab>
						: null}
				</Tabs>
			</Container>
		);
	}
}
