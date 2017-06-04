/* @flow */

import React, { Component } from "react";
import { Icon, Button, Image, Text, Thumbnail } from "native-base";
import {
	View,
	TouchableOpacity,
	AsyncStorage,
	Platform,
	ScrollView,
	Alert
} from "react-native";
import {
	DrawerNavigator,
	DrawerView,
	StackNavigator,
	DrawerItems,
	navigationOptions
} from "react-navigation";

import { logout } from "./api/requests";
import Lobby from "./components/Lobby";
import Login from "./components/Login";
import PrivateMessages from "./components/PrivateMessages";

//Return a view here with either the user profile image/logout or a login route
const MenuContent = (props, user) => {
	if (Object.keys(user).length) {
		//Logged in
		return (
			<View style={{ flex: 1 }}>
				<View style={styles.profileImage}>
					<Text>{user.username}</Text>
					<Thumbnail
						size={200}
						source={{ uri: user.profileImage.secure_url }}
					/>
				</View>
				<DrawerItems {...props} />
				<View style={styles.profileImage}>
					<Button
						iconLeft
						full
						transparent
						onPress={() => {
							Alert.alert("Logout?", null, [
								{ text: "Cancel" },
								{ text: "Logout", onPress: () => logout() }
							]);
						}}
					>
						<Icon name="log-out" />
						<Text style={{ fontWeight: "bold" }}>Log Out</Text>
					</Button>
				</View>
			</View>
		);
	} else {
		//Logged out
		return (
			<View style={{ flex: 1 }}>
				<DrawerItems {...props} />
			</View>
		);
	}
};

const MenuButton = ({ navigation }) => {
	return (
		<View style={styles.menuButton}>
			<TouchableOpacity
				onPress={() => {
					const { routes, index } = navigation.state;
					if (routes[index].routeName !== "DrawerClose") {
						navigation.navigate("DrawerClose");
					} else {
						navigation.navigate("DrawerOpen");
					}
				}}
			>
				<Icon name="menu" navigation={navigation.navigate} />
			</TouchableOpacity>
		</View>
	);
};

const UserDrawerRoutes = {
	Lobby: {
		screen: Lobby,
		title: "Lobby",
		navigationOptions: {
			drawerLabel: "Lobby",
			drawerIcon: <Icon name="apps" />,
			title: "Lobby",
			headerVisible: false
		}
	},
	Messages: {
		screen: PrivateMessages,
		title: "Messages",
		navigationOptions: {
			drawerLabel: "Messages",
			drawerIcon: <Icon name="mail" />,
			title: "Messages",
			headerVisible: false
		}
	}
};

const GuestDrawerRoutes = {
	Lobby: {
		screen: Lobby,
		title: "Lobby",
		navigationOptions: {
			drawerLabel: "Lobby",
			title: "Lobby",
			headerVisible: false
		}
	},
	Login: {
		screen: Login,
		title: "Login",
		navigationOptions: {
			drawerLabel: "Log In",
			title: "Log In",
			headerVisible: false
		}
	}
};

export const createNavigator = (
	loggedIn: boolean = false,
	user: Object = {}
) => {
	let routes = loggedIn ? UserDrawerRoutes : GuestDrawerRoutes;
	return StackNavigator(
		{
			Menu: {
				name: "Menu",
				screen: DrawerNavigator(routes, {
					mode: Platform.OS === "ios" ? "modal" : "card",
					drawerWidth: 200,
					contentComponent: props => MenuContent(props, user)
				}),
				contentComponent: props => MenuContent(props, user),
				navigationOptions: ({ navigation }) => ({
					headerLeft: <MenuButton navigation={navigation} />
				})
			}
		},
		{
			navigationOptions: ({ navigation }) => ({
				headerMode: "none"
			})
		}
	);
};

const styles = {
	menuButton: {
		marginLeft: 30
	},
	profileImage: {
		alignItems: "center",
		justifyContent: "center",
		marginTop: 20
	},
	center: {
		alignItems: "center",
		justifyContent: "center"
	}
};
