import React, { Component } from 'react';
import { View, Text, Alert } from 'react-native';
import { Thumbnail, Button, Icon } from 'native-base';
import Drawer from 'react-native-drawer';
import { Actions, DefaultRenderer } from 'react-native-router-flux';
import EventEmitter from 'react-native-eventemitter';
import { logout } from './api/requests';

class UserDrawer extends Component {
    constructor(props) {
        super(props);
        console.log(this.props);
        this.state = {
            room: null
        };
        EventEmitter.on('joinRoom', room => {
            this.setState({ room: room });
        });
    }

    getSideMenu() {
        let user = this.props.user;
        let room = this.state.room;
        console.log(room);
        return (
            <View style={styles.drawerContainer}>
                <Thumbnail source={{ uri: user.profileImage.secure_url }} />
                <Text> {user.username} </Text>
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
                                  Actions.Room();
                              }}
                          >
                              <Icon name="chatbubbles" />
                              <Text>{room.name}</Text>
                          </Button>
                        : null}
                    <Button
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
                    <Button
                        iconLeft
                        transparent
                        onPress={() => {
                            Alert.alert('Logout?', null, [
                                { text: 'Cancel' },
                                { text: 'Logout', onPress: () => logout() }
                            ]);
                            Actions.refresh();
                        }}
                    >
                        <Icon name="log-out" />
                        <Text> Log Out </Text>
                    </Button>
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
                onOpen={() => Actions.refresh({ key: state.key, open: true })}
                onClose={() => Actions.refresh({ key: state.key, open: false })}
                type="displace"
                content={SideMenu}
                tapToClose={true}
                openDrawerOffset={0.4}
                panOpenMask={0.35}
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
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        flexDirection: 'column'
    }
};

export default UserDrawer;
