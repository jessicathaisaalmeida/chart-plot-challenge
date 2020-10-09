import React from "react";
import InputArea from "./chartPlotting/InputArea";
import ChartArea from "./chartPlotting/ChartArea";
import "./styles.css";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.name = "Jéssica Thaisa Almeida";

    this.state = {
      data: `{type: 'start', timestamp: 1519780251293, select: ['min_response_time', 'max_response_time'], group: ['os', 'browser']}
{type: 'span', timestamp: 1519780251293, begin: 1519780251293, end: 1519780260201}
{type: 'data', timestamp: 1519780251000, os: 'linux', browser: 'chrome', min_response_time: 0.1, max_response_time: 1.3}
{type: 'stop', timestamp: 1519780251293}`,
      currentData: ""
    };
  }
  render() {
    return (
      <div className="App">
        <h1>{this.name}'s Challenge</h1>
        <InputArea
          value={this.state.data}
          onChange={(newValue) => this.setState({ data: newValue })}
        />
        <ChartArea
          data={this.state.currentData}
          onClick={() => this.setState({ currentData: this.state.data })}
        />
      </div>
    );
  }
}
