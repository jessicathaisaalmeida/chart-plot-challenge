import React from "react";
import InputArea from "./components/InputArea";
import ChartArea from "./components/ChartArea";
import "./styles.css";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.name = "Jéssica Thaisa Almeida";

    this.state = {
      data: `{type: 'start', timestamp: 1605013270000, select: ['min_response_time', 'max_response_time'], group: ['os', 'browser']}
{type: 'span', timestamp: 1605013270000, begin: 1605013270000, end: 1605013330000}
{type: 'data', timestamp: 1605013280000, os: 'linux', browser: 'chrome', min_response_time: 0.1, max_response_time: 1.5}
{type: 'data', timestamp: 1605013290000, os: 'windows', browser: 'firefox', min_response_time: 0.0, max_response_time: 2.3}
{type: 'data', timestamp: 1605013310000, os: 'fedora', browser: 'firefox', min_response_time: 0.1, max_response_time: 2.1}
{type: 'data', timestamp: 1605013320000, os: 'mac os', browser: 'safari', min_response_time: 0.3, max_response_time: 1.3}
{type: 'data', timestamp: 1605013320000, os: 'windows', browser: 'chrome', min_response_time: 0.2, max_response_time: 1.2}
{type: 'data', timestamp: 1605013330000, os: 'windows', browser: 'firefox', min_response_time: 0.5, max_response_time: 1.8}
{type: 'data', timestamp: 1605013330000, os: 'fedora', browser: 'firefox', min_response_time: 0.6, max_response_time: 2.9}
{type: 'data', timestamp: 1605013330000, os: 'fedora', browser: 'chrome', min_response_time: 0.15, max_response_time: 1.3}
{type: 'data', timestamp: 1605013330000, os: 'mac os', browser: 'safari', min_response_time: 0.45, max_response_time: 2.7}
{type: 'data', timestamp: 1605013360000, os: 'linux', browser: 'chrome', min_response_time: 0.3, max_response_time: 2.8}
{type: 'stop', timestamp: 1605013360000}`,
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
