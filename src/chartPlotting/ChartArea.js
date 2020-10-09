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
    let propName = prop.split(":")[0];
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
              let propName = propsAuxiliar.split(":")[0];
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
function prepareDataChart(informedData) {
  if (!informedData) return null;

  let instructions = getDataInstructions(informedData);

  console.log(instructions);

  return {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "My First dataset",
        fill: false,
        lineTension: 0.1,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: [65, 59, 80, 81, 56, 55, 40]
      }
    ]
  };
}

export default class ChartArea extends React.Component {
  render() {
    return (
      <div className="ChartArea">
        <div>{this.props.data.split("\n")[1]}</div>
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
