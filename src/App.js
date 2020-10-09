import React from "react";
import InputArea from "./chartPlotting/InputArea";
import ChartArea from "./chartPlotting/ChartArea";
import "./styles.css";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.name = "Jéssica Thaisa Almeida";

    this.state = {
      data: `{type: 'start', timestamp: 1604926800000, select: ['min_response_time', 'max_response_time'], group: ['os', 'browser']}
{type: 'span', timestamp: 1604890800000, begin: 1519780251293, end: 1606014000000}
{type: 'data', timestamp: 1604926800000, os: 'linux', browser: 'chrome', min_response_time: 0.1, max_response_time: 1.5}
{type: 'data', timestamp: 1604926800000, os: 'windows', browser: 'firefox', min_response_time: 0.0, max_response_time: 2.3}
{type: 'data', timestamp: 1604926800000, os: 'fedora', browser: 'firefox', min_response_time: 0.1, max_response_time: 2.1}
{type: 'data', timestamp: 1604926800000, os: 'mac os', browser: 'safari', min_response_time: 0.3, max_response_time: 1.3}
{type: 'data', timestamp: 1605409200000, os: 'windows', browser: 'chrome', min_response_time: 0.2, max_response_time: 1.2}
{type: 'data', timestamp: 1605409200000, os: 'windows', browser: 'firefox', min_response_time: 0.5, max_response_time: 1.8}
{type: 'data', timestamp: 1605409200000, os: 'fedora', browser: 'firefox', min_response_time: 0.6, max_response_time: 2.9}
{type: 'data', timestamp: 1605409200000, os: 'fedora', browser: 'chrome', min_response_time: 0.15, max_response_time: 1.3}
{type: 'data', timestamp: 1605409200000, os: 'mac os', browser: 'safari', min_response_time: 0.45, max_response_time: 2.7}
{type: 'data', timestamp: 1606100400000, os: 'linux', browser: 'chrome', min_response_time: 0.3, max_response_time: 2.8}
{type: 'stop', timestamp: 1604926800000}`,
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
