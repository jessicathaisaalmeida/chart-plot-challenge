import React from "react";
import { Line } from "react-chartjs-2";
import Button from "@material-ui/core/Button";
import { parseEventStreamToList } from "./eventStreamParser";
import { reduceEventsInGroups } from "./eventListReducer";

const GenerateChartArea = {
  width: "100%",
  backgroundColor: "lightgray",
  bottom: "0px",
  padding: "10px"
};

let chartOptions = {};

function formatTimeLabel(timestamp) {
  let date = new Date(timestamp);

  return (
    date.getHours() +
    ":" +
    ("00" + date.getMinutes()).slice(-2) +
    ":" +
    ("00" + date.getSeconds()).slice(-2)
  );
}

function formatDateLabel(timestamp) {
  let date = new Date(timestamp);

  return date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
}

function generateChartOptions(labels) {
  chartOptions = {
    responsive: true,
    elements: {
      line: {
        fill: false
      }
    },
    scales: {
      xAxes: [
        {
          labels: labels,
          display: true,
          gridLines: {
            display: false
          },
          ticks: {
            // Include a dollar sign in the ticks
            callback: function (value, index, values) {
              return formatTimeLabel(value);
            }
          }
        }
      ],
      yAxes: [
        {
          type: "linear",
          display: true,
          position: "left",
          gridLines: {
            display: true
          },
          labels: {
            show: false
          }
        }
      ]
    },

    tooltips: {
      callbacks: {
        title: function (tooltipItem, data) {
          return (
            formatDateLabel(Number(tooltipItem[0].label)) +
            " " +
            formatTimeLabel(Number(tooltipItem[0].label))
          );
        }
      }
    }
  };
}

function chartGenerate(eventStream) {
  let eventGroups = reduceEventsInGroups(parseEventStreamToList(eventStream));

  generateChartOptions(eventGroups.labels);

  return {
    datasets: eventGroups.datasets
  };
}

function prepareDataChart(eventStream) {
  if (!eventStream) return null;

  return chartGenerate(eventStream);
}

export default class ChartArea extends React.Component {
  render() {
    return (
      <div className="ChartArea">
        <Line data={prepareDataChart(this.props.data)} options={chartOptions} />
        <div style={GenerateChartArea}>
          <Button
            variant="contained"
            color="primary"
            onClick={this.props.onClick}
          >
            Generate Chart
          </Button>
        </div>
      </div>
    );
  }
}
