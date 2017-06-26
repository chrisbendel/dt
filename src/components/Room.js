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
import YouTube from "react-native-youtube";

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

	render() {
		return (
			<Container style={{ marginTop: 100, height: 400 }}>
				<YouTube
					ref="youtubePlayer"
					videoId="LaLINFjBRPM"
					play={true}
					rel={false}
					fullscreen={false}
					showFullscreenButton={true}
					showinfo={false}
					controls={0}
					apiKey={"AIzaSyBkJJ0ZoT8XbBDYpZ8sVr1OkVev4C5poWI"}
					origin={"https://www.youtube.com"}
					style={{
						alignSelf: "stretch",
						height: 300,
						width: 200
					}}
				/>
			</Container>
		);

		// return (
		// 	<Container>
		// 		<Video room={this.props.room} ee={this.ee} />
		// 	</Container>
		// );
		// return (
		// 	<Container>
		// 		<Header hasTabs locked />
		// 		<Tabs>
		// 			<Tab heading="Video">
		// 				<Video room={this.props.room} ee={this.ee} />
		// 			</Tab>
		// 			<Tab heading="Chat">
		// 				<Chat room={this.props.room} ee={this.ee} user={this.state.user} />
		// 			</Tab>
		// 			<Tab heading="Users">
		// 				<Users id={this.props.room._id} ee={this.ee} />
		// 			</Tab>
		// 			{this.state.user
		// 				? <Tab heading="Playlists">
		// 						<Playlists id={this.props.room._id} />
		// 					</Tab>
		// 				: null}
		// 		</Tabs>
		// 	</Container>
		// );
	}
}
