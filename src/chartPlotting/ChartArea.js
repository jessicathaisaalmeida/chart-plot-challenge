import React from "react";
import { Line } from "react-chartjs-2";
import Button from "@material-ui/core/Button";

const GenerateChartArea = {
  width: "100%",
  backgroundColor: "lightgray",
  bottom: "0px",
  padding: "10px"
};

function getValueFromString(data) {
  data = data.trim();
  if (data[0] === "'") return data.substring(1, data.length - 1);
  else if (!isNaN(data) && !isNaN(parseFloat(data))) return Number(data);
  else if (data[0] === "[") return getArrayFromString(data);
}

function getArrayFromString(data) {
  if (!data) return null;
  data = data.trim().substring(1, data.length - 1);
  let theArray = [];
  data.split(",").forEach((element) => {
    theArray.push(getValueFromString(element));
  });
  return theArray;
}

function getPropsFromSimpleString(data) {
  let props = {};
  data.split(",").forEach((prop) => {
    let propName = prop.split(":")[0].trim();
    let propValue = prop.split(":")[1];
    propValue = propValue.trim();
    propValue = getValueFromString(propValue);

    props[propName] = propValue;
  });
  return props;
}

const propsDefinitions = {
  timestamp: "Number",
  select: "Array",
  group: "Array"
};

function getDataInstructions(informedData) {
  let instructions = [];
  informedData.split("\n").forEach((row) => {
    row = row
      .trim()
      .substring(1, row.length - 1)
      .split("type:")[1]
      .trim();

    if (row.indexOf("start") !== -1) {
      while (row.indexOf(",") !== -1) {
        row = row.substring(row.indexOf(",") + 1).trim();
        let props = {};
        Object.keys(propsDefinitions).forEach((key) => {
          if (row.indexOf(key) !== -1) {
            let final = 0;
            if (propsDefinitions[key] === "Array") {
              final = row.indexOf("]");
              let propsAuxiliar = row.substring(0, final);
              let propName = propsAuxiliar.split(":")[0].trim();
              let propValue = propsAuxiliar.split(":")[1];
              propValue = getArrayFromString(propValue);
              props[propName] = propValue;
              row = row.substring(final + 1);
              final = row.indexOf(",");
            } else {
              final = row.indexOf(",");
              let propsAuxiliar = getPropsFromSimpleString(
                row.substring(0, final)
              );
              props[key] = propsAuxiliar[key];
            }
            row = row.substring(final + 1);
          }
        });

        if (Object.keys(props).length > 0) {
          props["type"] = "start";
          instructions.push(props);
        }
      }
    } else {
      let props = getPropsFromSimpleString(row.substring(row.indexOf(",") + 1));
      props["type"] = row.substring(1, row.indexOf(",") - 1).trim();
      instructions.push(props);
    }
  });

  return instructions;
}

function isInPast(moment) {
  if (moment < new Date().getTime()) return true;
  return false;
}

const randomColor = ((opacity) => {
  const randomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  return (opacity) => {
    var r = randomInt(0, 255);
    var g = randomInt(0, 255);
    var b = randomInt(0, 255);

    return `rgba(${r},${g},${b},${opacity})`;
  };
})();

function prepareDataChart(informedData) {
  if (!informedData) return null;

  let instructions = getDataInstructions(informedData);

  let chartLabels = [];
  let chartGroups = [];
  let datasets = {};
  let plotDataset = [];
  instructions.forEach((instruction) => {
    if (instruction.type === "start") {
      chartLabels = instruction.select;
      chartGroups = instruction.group;
    } else if (instruction.type === "data") {
      if (isInPast(instruction.timestamp)) return;
      let dataSetKey = "";
      let chartLabel = "";
      chartGroups.forEach((group) => {
        dataSetKey += instruction[group] + "_#_";
        chartLabel += instruction[group] + " ";
      });
      if (!datasets[dataSetKey]) {
        datasets[dataSetKey] = {};
      }
      chartLabels.forEach((label) => {
        //if it doesn't exists yet, here I create the basis structure
        if (!datasets[dataSetKey][label]) {
          let color = randomColor(0.6);
          let dataset = {
            label: (chartLabel + label.replaceAll("_", " "))
              .split(/ /g)
              .map(
                (word) =>
                  `${word.substring(0, 1).toUpperCase()}${word.substring(1)}`
              )
              .join(" "),
            type: "line",
            fill: false,
            lineTension: 0.1,
            backgroundColor: color,
            borderColor: color,
            borderCapStyle: "butt",
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderColor: color,
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: color,
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 7,
            pointHitRadius: 10,
            data: []
          };
          datasets[dataSetKey][label] = dataset;
        }
        datasets[dataSetKey][label]["data"].push({
          x: instruction["timestamp"],
          y: instruction[label]
        });
      });
    } else if (instruction.type === "stop") {
      return;
    }
  });

  Object.keys(datasets).forEach((group) => {
    Object.keys(datasets[group]).forEach((label) => {
      plotDataset.push(datasets[group][label]);
    });
  });

  return {
    datasets: plotDataset
  };
}

export default class ChartArea extends React.Component {
  render() {
    return (
      <div className="ChartArea">
        <Line data={prepareDataChart(this.props.data)} />
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
