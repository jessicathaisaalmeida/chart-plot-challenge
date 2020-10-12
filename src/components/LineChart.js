import React from "react";
import { Line } from "react-chartjs-2";

export default class LineChart extends React.Component {
  render() {
    return (
      <div className="LineChart">
        <Line
          data={this.props.chartData.dataset}
          options={this.props.chartData.options}
        />
      </div>
    );
  }
}
