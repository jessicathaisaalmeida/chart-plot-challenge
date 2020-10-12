import React from "react";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-solarized_dark";

const fullSizedEditor = {
  width: "100%",
  height: "100%",
  fontFamily: "'Source Code Pro', sans-serif",
  position: "relative"
};

export default class InputArea extends React.Component {
  render() {
    return (
      <div className="InputArea">
        <AceEditor
          style={fullSizedEditor}
          mode="javascript"
          theme="solarized_dark"
          showPrintMargin={false}
          onChange={this.props.onChange}
          value={this.props.value}
        />
      </div>
    );
  }
}
