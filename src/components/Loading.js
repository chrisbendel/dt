import React, { Component } from "react";
import { Dimensions } from "react-native";
import { Container, Body, Spinner } from "native-base";

export default class FullSpinner extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Container>
        <Body style={styles.Body}>
          <Spinner color="#CECECE" />
        </Body>
      </Container>
    );
  }
}

const { height: screenHeight } = Dimensions.get("window");
const styles = {
  Body: {
    flex: 1,
    height: screenHeight,
    justifyContent: "center",
    alignItems: "center"
  }
};
