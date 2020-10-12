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

export const reduceEventsInGroups = (eventList) => {
  let chartLabels = [];
  let chartGroups = [];
  let datasets = {};
  let plotLabels = [];
  let begin = 0;
  let end = 0;
  let stopped = false;
  eventList.every((instruction) => {
    if (instruction.type === "start") {
      chartLabels = instruction.select;
      chartGroups = instruction.group;
      begin = end = instruction.timestamp;
    } else if (instruction.type === "span") {
      begin = instruction.begin;
      end = instruction.end;
    } else if (instruction.type === "data") {
      if (instruction.timestamp > end || instruction.timestamp < begin)
        return true;
      let dataSetKey = "";
      let chartLabel = "";
      chartGroups.forEach((group) => {
        dataSetKey += instruction[group] + "_#_";
        chartLabel += instruction[group] + " ";
      });
      if (!datasets[dataSetKey]) {
        datasets[dataSetKey] = {};
      }
      chartLabels.every((label) => {
        if (plotLabels.length === 0) plotLabels.push(instruction.timestamp);
        else {
          if (instruction.timestamp < plotLabels[plotLabels.length - 1]) {
            stopped = true;
            return false;
          } else if (
            instruction.timestamp > plotLabels[plotLabels.length - 1]
          ) {
            plotLabels.push(instruction.timestamp);
          }
        }

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

        //insert in chart
        datasets[dataSetKey][label].data.push({
          x: instruction.timestamp,
          y: instruction[label]
        });

        return true;
      });

      return !stopped;
    } else if (instruction.type === "stop") {
      stopped = true;
      return false;
    }
    return true;
  });

  let plotDataset = [];
  Object.keys(datasets).forEach((group) => {
    Object.keys(datasets[group]).forEach((label) => {
      plotDataset.push(datasets[group][label]);
    });
  });
  return {
    labels: plotLabels,
    datasets: plotDataset
  };
};
