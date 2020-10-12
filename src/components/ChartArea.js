import React from "react";
import LineChart from "./LineChart";
import Button from "@material-ui/core/Button";
import { parseEventStreamToList } from "./eventStreamParser";
import { reduceEventsInGroups } from "./eventListReducer";

const GenerateChartArea = {
  width: "100%",
  backgroundColor: "lightgray",
  bottom: "0px",
  padding: "10px"
};

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
  return {
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

function chartDataFromEventStream(eventStream) {
  if (!eventStream) return { dataset: { datasets: [] }, options: {} };
  let eventGroups = reduceEventsInGroups(parseEventStreamToList(eventStream));

  return {
    dataset: { datasets: eventGroups.datasets },
    options: generateChartOptions(eventGroups.labels)
  };
}

export default class ChartArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      generationError: "",
      chartData: { dataset: { datasets: [] }, options: {} }
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.eventStream) {
      //try {
      this.setState({
        generationError: "",
        chartData: chartDataFromEventStream(newProps.eventStream)
      });
      /*} catch (err) {
        this.setState({
          generationError: err.message,
          chartData: { dataset: { datasets: [] }, options: {} }
        });
      }*/
    }
  }

  render() {
    return (
      <div className="ChartArea">
        <span>{this.state.generationError}</span>

        {this.state.chartData ? (
          <LineChart chartData={this.state.chartData} />
        ) : null}

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
