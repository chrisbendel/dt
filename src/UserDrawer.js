import React, { Component } from "react";
import { View, Text, Alert, AsyncStorage } from "react-native";
import { Thumbnail, Button, Icon } from "native-base";
import Drawer from "react-native-drawer";
import { Actions, DefaultRenderer } from "react-native-router-flux";
import EventEmitter from "react-native-eventemitter";
import { logout } from "./api/requests";

class UserDrawer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            room: null,
            user: null
        };

        EventEmitter.on("joinRoom", room => {
            this.setState({ room: room });
        });

        EventEmitter.on("login", user => {
            Actions.Lobby();
            // this.socket = new Socket(user._id);
            this.setState({ user: user });
        });

        EventEmitter.on("logout", () => {
            Actions.Lobby();
            // this.socket = new Socket();
            this.setState({ user: null });
        });
    }

    componentWillMount() {
        AsyncStorage.getItem("user").then(user => {
            if (user) {
                let info = JSON.parse(user);
                console.log(info);
                // this.socket = new Socket(info._id);
                this.setState({ user: info });
            } else {
                // this.socket = new Socket();
                this.setState({ user: null });
            }
        });
    }

    getSideMenu() {
        let user = this.state.user;
        let room = this.state.room;
        return (
            <View style={styles.drawerContainer}>
                {user
                    ? <View>
                          <Thumbnail
                              source={{ uri: user.profileImage.secure_url }}
                          />
                          <Text> {user.username} </Text>
                      </View>
                    : null}
                <View>
                    <Button
                        iconLeft
                        transparent
                        onPress={() => {
                            this._drawer.close();
                            Actions.Lobby();
                        }}
                    >
                        <Icon name="apps" />
                        <Text> Lobby </Text>
                    </Button>
                    {room
                        ? <Button
                              iconLeft
                              transparent
                              onPress={() => {
                                  this._drawer.close();
                                  Actions.Room({
                                      room: room,
                                      title: room.name
                                  });
                              }}
                          >
                              <Icon name="chatbubbles" />
                              <Text>{room.name}</Text>
                          </Button>
                        : null}
                    {user
                        ? <Button
                              iconLeft
                              transparent
                              onPress={() => {
                                  this._drawer.close();
                                  Actions.Messages();
                              }}
                          >
                              <Icon name="mail" />
                              <Text> Messages </Text>
                          </Button>
                        : null}
                    {user
                        ? <Button
                              iconLeft
                              transparent
                              onPress={() => {
                                  Alert.alert("Logout?", null, [
                                      { text: "Cancel" },
                                      {
                                          text: "Logout",
                                          onPress: () => logout()
                                      }
                                  ]);
                                  Actions.refresh();
                              }}
                          >
                              <Icon name="log-out" />
                              <Text> Log Out </Text>
                          </Button>
                        : <Button
                              iconLeft
                              transparent
                              onPress={() => {
                                  this._drawer.close();
                                  Actions.Login();
                              }}
                          >
                              <Icon name="log-in" />
                              <Text> Log In </Text>
                          </Button>}
                </View>
            </View>
        );
    }

    render() {
        const SideMenu = this.getSideMenu();
        const state = this.props.navigationState;
        const children = state.children;
        return (
            <Drawer
                ref={ref => (this._drawer = ref)}
                open={state.open}
                // onOpen={() => Actions.refresh({ key: state.key, open: true })}
                // onClose={() => Actions.refresh({ key: state.key, open: false })}
                type="displace"
                content={SideMenu}
                tapToClose={true}
                openDrawerOffset={0.4}
                panOpenMask={0}
                panCloseMask={0.4}
                panThreshold={0.5}
                negotiatePan={true}
                tweenHandler={ratio => ({
                    main: { opacity: Math.max(0.54, 1 - ratio) }
                })}
            >
                <DefaultRenderer
                    navigationState={children[0]}
                    onNavigate={this.props.onNavigate}
                />
            </Drawer>
        );
    }
}

const styles = {
    drawerContainer: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        flexDirection: "column"
    }
};

export default UserDrawer;
