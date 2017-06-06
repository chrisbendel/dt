import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Thumbnail, Button, Icon } from 'native-base';
import Drawer from 'react-native-drawer';
import { Actions, DefaultRenderer } from 'react-native-router-flux';

class MyDrawer extends Component {
    constructor(props) {
        super(props);
        console.log(this.props);
    }
    getSideMenu() {
        let user = this.props.user;
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
                panCloseMask={0.4}
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

export default MyDrawer;
