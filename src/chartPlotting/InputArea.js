import React from "react";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";

//import styled from 'styled-components';

const fullSizedEditor = {
  width: "100%",
  fontFamily: "'Source Code Pro', sans-serif"
};

export default class InputArea extends React.Component {
  render() {
    return (
      <div className="InputArea">
        <AceEditor
          style={fullSizedEditor}
          mode="javascript"
          theme="monokai"
          onChange={() => {}}
        />
      </div>
    );
  }
}
