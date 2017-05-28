/* @flow */

import React, { Component } from "react";
import { Icon, Button, Image, Text } from "native-base";
import { View, TouchableOpacity, AsyncStorage, Platform } from "react-native";
import {
	DrawerNavigator,
	TabNavigator,
	StackNavigator,
	DrawerItems,
	NavigationActions,
	navigationOptions
} from "react-navigation";
import Lobby from "./components/Lobby";
import PrivateMessages from "./components/PrivateMessages";

const DrawerIcon = ({ navigation }) => {
	return (
		<View style={styles.drawerButton}>
			<TouchableOpacity
				onPress={() => {
					console.log(navigation);
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

const DrawerContent = (props, user) => {
	console.log(props);
	console.log(user);
	return (
		<View style={{ flex: 1 }}>
			<DrawerItems {...props} />
		</View>
	);
};

const UserStack = {
	Lobby: {
		screen: Lobby,
		navigationOptions: {
			drawerLabel: "Lobby",
			title: "Lobby"
		}
	},
	PrivateMessages: {
		screen: PrivateMessages,
		navigationOptions: {
			drawerLabel: "Messages",
			title: "Messages"
		}
	}
};

const UserDrawerRoutes = {
	Lobby: {
		name: "Lobby",
		screen: StackNavigator(UserStack, {
			initialRouteName: "Lobby",
			headerMode: "none"
		})
	},
	PrivateMessages: {
		name: "Messages",
		screen: StackNavigator(UserStack, {
			initialRouteName: "PrivateMessages",
			headerMode: "none"
		})
	}
};

const GuestStack = {
	Lobby: {
		screen: Lobby,
		navigationOptions: {
			drawerLabel: "Lobby",
			title: "Lobby"
		}
	}
};

const GuestDrawerRoutes = {
	Lobby: {
		name: "Lobby",
		screen: StackNavigator(UserStack, {
			initialRouteName: "Lobby",
			headerMode: "none"
		})
	}
};

export const createNavigator = (
	loggedIn: boolean = false,
	user: Object = { test: "hi" }
) => {
	return new StackNavigator(
		{
			Drawer: {
				name: "Drawer",
				screen: DrawerNavigator(
					loggedIn ? UserDrawerRoutes : GuestDrawerRoutes,
					{
						drawerWidth: 200,
						contentComponent: props => DrawerContent(props, user),
						mode: Platform.OS === "ios" ? "modal" : "card"
					}
				)
			},
			...(loggedIn ? UserStack : GuestStack)
		},
		{
			navigationOptions: ({ navigation }) => ({
				tabBarVisible: false,
				headerLeft: <DrawerIcon navigation={navigation} />
			})
		}
	);
};

const styles = {
	drawerButton: {
		marginLeft: 30
	}
};
