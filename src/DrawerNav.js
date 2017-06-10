import React, { Component } from "react";
import {
    View,
    Text,
    Alert,
    AsyncStorage,
    WebView,
    Linking
} from "react-native";
import { Thumbnail, Button, Icon } from "native-base";
import Drawer from "react-native-drawer";
import { Actions, DefaultRenderer } from "react-native-router-flux";
import { logout, joinRoom } from "./api/requests";
import { AdMobRewarded } from "react-native-admob";

class DrawerNav extends Component {
    constructor(props) {
        super(props);

        this.state = {
            room: null,
            user: null
        };

        this.ee = this.props.ee;

        this.ee.addListener("joinRoom", room => {
            this.setState({ room: room });
        });

        this.ee.addListener("login", user => {
            this.setState({ user });
        });

        AdMobRewarded.setTestDeviceID("EMULATOR");
        AdMobRewarded.setAdUnitID("ca-app-pub-7092420459681661/6015374839");

        AdMobRewarded.addEventListener(
            "rewardedVideoDidRewardUser",
            (type, amount) =>
                console.log("rewardedVideoDidRewardUser", type, amount)
        );
        AdMobRewarded.addEventListener("rewardedVideoDidLoad", () =>
            console.log("rewardedVideoDidLoad")
        );
        AdMobRewarded.addEventListener("rewardedVideoDidFailToLoad", error =>
            console.log("rewardedVideoDidFailToLoad", error)
        );
        AdMobRewarded.addEventListener("rewardedVideoDidOpen", () =>
            console.log("rewardedVideoDidOpen")
        );
        AdMobRewarded.addEventListener("rewardedVideoDidClose", () => {
            console.log("rewardedVideoDidClose");
            AdMobRewarded.requestAd(error => error && console.log(error));
        });
        AdMobRewarded.addEventListener(
            "rewardedVideoWillLeaveApplication",
            () => console.log("rewardedVideoWillLeaveApplication")
        );

        AdMobRewarded.requestAd(error => error && console.log(error));
    }

    logout() {
        this.ee.emit("logout");
        logout();
        Actions.refresh({
            type: "reset"
        });
        this.setState({ user: null });
    }

    componentWillMount() {
        AsyncStorage.getItem("user").then(user => {
            if (user) {
                let info = JSON.parse(user);
                // this.socket = new Socket(info._id);
                this.setState({ user: info });
            }
        });
    }

    componentDidMount() {}

    getSideMenu() {
        let user = this.state.user;
        let room = this.state.room;
        return (
            <View style={styles.drawerContainer}>
                <View>
                    {user
                        ? <Button
                              style={{ marginBottom: 20 }}
                              iconLeft
                              transparent
                          >
                              <Thumbnail
                                  small
                                  source={{ uri: user.profileImage.secure_url }}
                              />
                              <Text> {user.username} </Text>
                          </Button>
                        : null}
                    <Button
                        iconLeft
                        transparent
                        onPress={() => {
                            this._drawer.close();
                            Actions.Lobby({ type: "reset" });
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
                                  joinRoom(room._id).then(() => {
                                      Actions.Room({
                                          room: room,
                                          title: room.name
                                      });
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
                                  Actions.Messages({ type: "reset" });
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
                                          onPress: () => {
                                              this._drawer.close();
                                              this.logout();
                                          }
                                      }
                                  ]);
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
                    {user
                        ? null
                        : <Button
                              iconLeft
                              transparent
                              onPress={() => {
                                  Linking.openURL(
                                      "https://www.dubtrack.fm/signup"
                                  );
                              }}
                          >
                              <Icon name="person-add" />
                              <Text> Sign Up </Text>
                          </Button>}
                    <Button
                        style={{ marginTop: 30 }}
                        iconLeft
                        transparent
                        onPress={() => {
                            Linking.openURL("https://paypal.me/chrissbendel");
                        }}
                    >
                        <Icon name="cash" />
                        <Text note>Buy me a coffee or five</Text>
                    </Button>
                    <Button transparent>
                        <Text note> or </Text>
                    </Button>
                    <Button
                        transparent
                        iconLeft
                        onPress={() => {
                            AdMobRewarded.showAd(
                                error => error && console.log(error)
                            );
                        }}
                    >
                        <Icon name="videocam" />
                        <Text>Watch a quick ad to help support me</Text>
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
    },
    center: {
        justifyContent: "center",
        alignItems: "center"
    }
};

export default DrawerNav;
