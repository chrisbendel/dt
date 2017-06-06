import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Drawer from 'react-native-drawer';
import { Actions, DefaultRenderer } from 'react-native-router-flux';

class MyDrawer extends Component {
    getSideMenu() {}
    render() {
        const SideMenu = <View><Text>Hi</Text></View>;
        const state = this.props.navigationState;
        const children = state.children;
        return (
            <Drawer
                ref="navigation"
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

export default MyDrawer;
