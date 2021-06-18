import React, { Component } from "react";
import * as Bulma from "react-bulma-components";

export default class Main extends Component {
  render() {
    return (
      <Bulma.Block>
        <Bulma.Columns>
          <Bulma.Columns.Column is="1">
            <Bulma.Notification color="primary">ASD</Bulma.Notification>
          </Bulma.Columns.Column>
        </Bulma.Columns>
      </Bulma.Block>
    );
  }
}
