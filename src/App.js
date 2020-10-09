import React from "react";
import InputArea from "./chartPlotting/InputArea";
import ChartArea from "./chartPlotting/ChartArea";
import "./styles.css";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.name = "Jéssica Thaisa Almeida";
  }

  render() {
    return (
      <div className="App">
        <h1>{this.name}'s Challenge</h1>
        <InputArea />
        <ChartArea />
      </div>
    );
  }
}
