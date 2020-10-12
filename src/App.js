import React from "react";
import InputArea from "./components/InputArea";
import ChartArea from "./components/ChartArea";
import Button from "@material-ui/core/Button";
import SplitterLayout from "react-splitter-layout";
import "react-splitter-layout/lib/index.css";

import "./styles.css";

const inicialData = `{type: 'start', timestamp: 1605013270000, select: ['min_response_time', 'max_response_time'], group: ['os', 'browser']}
{type: 'span', timestamp: 1605013270000, begin: 1605013270000, end: 1605013330000}
{type: 'data', timestamp: 1605013280000, os: 'linux', browser: 'chrome', min_response_time: 0.1, max_response_time: 1.5}
{type: 'data', timestamp: 1605013290000, os: 'windows', browser: 'firefox', min_response_time: 0.0, max_response_time: 2.3}
{type: 'data', timestamp: 1605013310000, os: 'fedora', browser: 'firefox', min_response_time: 0.1, max_response_time: 2.1}
{type: 'data', timestamp: 1605013320000, os: 'mac os', browser: 'safari', min_response_time: 0.3, max_response_time: 1.3}
{type: 'data', timestamp: 1605013320000, os: 'windows', browser: 'chrome', min_response_time: 0.2, max_response_time: 1.2}
{type: 'data', timestamp: 1605013330000, os: 'windows', browser: 'firefox', min_response_time: 0.5, max_response_time: 1.8}
{type: 'data', timestamp: 1605013330000, os: 'fedora', browser: 'firefox', min_response_time: 0.6, max_response_time: 2.9}
{type: 'data', timestamp: 1605013330000, os: 'linux', browser: 'chrome', min_response_time: 0.2, max_response_time: 1.3}
{type: 'data', timestamp: 1605013330000, os: 'mac os', browser: 'safari', min_response_time: 0.45, max_response_time: 2.7}
{type: 'data', timestamp: 1605013360000, os: 'linux', browser: 'chrome', min_response_time: 0.3, max_response_time: 2.8}
{type: 'stop', timestamp: 1605013360000}`;

export const dots = () => {
  return Array(1000).join(". ");
};
export const oos = () => {
  return Array(1000).join("o ");
};

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.name = "Jéssica Thaisa Almeida";

    this.state = {
      data: inicialData,
      currentData: ""
    };
  }

  render() {
    return (
      <div className="App">
        <SplitterLayout
          vertical={true}
          percentage={true}
          primaryIndex={0}
          secondaryInitialSize={65}
          primaryMinSize={25}
          secondaryMinSize={50}
        >
          <div className="input">
            <div className="title">{this.name}'s Challenge</div>
            <InputArea
              value={this.state.data}
              onChange={(newValue) => this.setState({ data: newValue })}
            />
          </div>
          <div className="chart">
            <ChartArea eventStream={this.state.currentData} />
          </div>
        </SplitterLayout>
        <div className="button">
          <Button
            variant="contained"
            color="primary"
            onClick={() => this.setState({ currentData: this.state.data })}
          >
            Generate Chart
          </Button>
        </div>
      </div>
    );
  }
}
