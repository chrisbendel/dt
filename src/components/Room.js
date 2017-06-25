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
import { View, AsyncStorage, FlatList } from "react-native";
import { getUserAvatar, getUserInfo, chat } from "./../api/requests";
import Playlists from "./room/Playlists";
import Users from "./room/Users";
import Chat from "./room/Chat";
import Video from "./Video";

export default class Room extends Component {
	constructor(props) {
		super(props);
		this.state = {
			user: null
		};

		this.ee = this.props.ee;
	}

	componentWillMount() {
		AsyncStorage.getItem("user").then(user => {
			this.setState({ user: JSON.parse(user) });
		});
	}

	componentWillUnmount() {}

	render() {
		return (
			<Container>
				<Header />
				<Tabs>
					<Tab heading="Video">
						<Video room={this.props.room} ee={this.ee} />
					</Tab>
					<Tab heading="Chat">
						<Chat room={this.props.room} ee={this.ee} user={this.state.user} />
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
