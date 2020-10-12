import React from "react";
import LineChart from "./LineChart";
import { parseEventStreamToList } from "./eventStreamParser";
import { reduceEventsInDataChart } from "./eventListReducer";

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

function generateChartOptions(chart) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      line: {
        fill: false
      }
    },

    legend: {
      display: true,
      position: "right",
      labels: {
        usePointStyle: true
      },
      padding: 30
    },

    scales: {
      xAxes: [
        {
          labels: chart.labels,
          display: true,
          gridLines: {
            display: false
          },
          ticks: {
            // Include a dollar sign in the ticks
            callback: function (value, index, values) {
              return formatTimeLabel(value);
            },
            min: chart.begin,
            max: chart.end
          }
        }
      ],
      yAxes: [
        {
          type: "linear",
          position: "left",
          gridLines: {
            display: true
          },
          ticks: {
            beginAtZero: true,
            display: false
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
  let eventsDataChart = reduceEventsInDataChart(
    parseEventStreamToList(eventStream)
  );

  console.log(eventsDataChart);

  return {
    dataset: { datasets: eventsDataChart.datasets },
    options: generateChartOptions(eventsDataChart)
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
    try {
      if (newProps.eventStream) {
        this.setState({
          generationError: "",
          chartData: chartDataFromEventStream(newProps.eventStream)
        });
      }
    } catch (error) {
      this.setState({
        generationError: error.message,
        chartData: null
      });
    }
  }

  render() {
    return (
      <div
        className="ChartArea"
        style={{ position: "relative", height: "40vh", width: "80vw" }}
      >
        <span>{this.state.generationError}</span>

        {this.state.chartData ? (
          <LineChart chartData={this.state.chartData} />
        ) : null}
      </div>
    );
  }
}
