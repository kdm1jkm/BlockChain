import React, { Component } from "react";
import Styled from "styled-components";

const Header = Styled.h1`
  text-align: center;
`;

export default class Main extends Component {
  render() {
    return <Header>BlockChain Simulator</Header>;
  }
}
