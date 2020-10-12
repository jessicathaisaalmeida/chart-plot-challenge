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

export const getSerie = (chartLabel, serie) => {
  let color = randomColor(0.6);
  return {
    label: (chartLabel + serie.replaceAll("_", " "))
      .split(/ /g)
      .map(
        (word) => `${word.substring(0, 1).toUpperCase()}${word.substring(1)}`
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
};

export const reduceStartEvent = {
  isMyTypeOfEvent: function (event, chart) {
    // check if this event is a start
    return (
      (!chart ||
        !chart.labels ||
        chart.labels.length <= 1 ||
        event.timestamp >= chart.labels[chart.labels.length - 1]) &&
      event.type === "start"
    );
  },
  operate: function (event, chart) {
    return {
      series: event.select,
      labels: [],
      categories: event.group,
      datasets: {},
      begin: event.timestamp,
      end: event.timestamp,
      isStopped: false
    };
  }
};

export const reduceSpanEvent = {
  isMyTypeOfEvent: function (event, chart) {
    // check if this event is a span
    return (
      (!chart ||
        !chart.labels ||
        chart.labels.length <= 1 ||
        event.timestamp >= chart.labels[chart.labels.length - 1]) &&
      event.type === "span"
    );
  },
  operate: function (event, chart) {
    return {
      ...chart,
      begin: event.begin,
      end: event.end
    };
  }
};

export const reduceStopEvent = {
  isMyTypeOfEvent: function (event, chart) {
    // check if this event is a stop
    return (
      (chart &&
        chart.labels &&
        chart.labels.length > 1 &&
        event.timestamp < chart.labels[chart.labels.length - 1]) ||
      event.type === "stop"
    );
  },
  operate: function (event, chart) {
    return {
      ...chart,
      isStopped: true
    };
  }
};

export const reduceDataEvent = {
  isMyTypeOfEvent: function (event, chart) {
    // check if this event is a data
    return (
      (!chart ||
        !chart.labels ||
        chart.labels.length <= 1 ||
        event.timestamp >= chart.labels[chart.labels.length - 1]) &&
      event.type === "data" &&
      !chart.isStopped
    );
  },
  operate: function (event, chart) {
    let dataSetKey = "";
    let chartLabel = "";

    chart.categories.forEach((category) => {
      dataSetKey += event[category] + "'";
      chartLabel += event[category] + " ";
    });

    if (!chart.datasets[dataSetKey]) {
      chart.datasets[dataSetKey] = {};
    }

    chart.series.forEach((serie) => {
      // includes the label in the chart if it's a new timestamp
      if (chart.labels.length === 0) chart.labels.push(event.timestamp);
      else if (event.timestamp > chart.labels[chart.labels.length - 1]) {
        chart.labels.push(event.timestamp);
      }

      //if it doesn't exists the data for the series here it base structure is created
      if (!chart.datasets[dataSetKey][serie]) {
        let dataset = getSerie(chartLabel, serie);
        chart.datasets[dataSetKey][serie] = dataset;
      }

      //insert the data in the correct series
      chart.datasets[dataSetKey][serie].data.push({
        x: event.timestamp,
        y: event[serie]
      });
    });

    return chart;
  }
};

export const eventReducers = [
  reduceStopEvent,
  reduceStartEvent,
  reduceDataEvent,
  reduceSpanEvent
];

export const reduceEventsInDataChart = (eventList) => {
  let chart = null;
  eventList.forEach((event) => {
    eventReducers.forEach(
      (reducer) =>
        (chart = reducer.isMyTypeOfEvent(event, chart)
          ? reducer.operate(event, chart)
          : chart)
    );
  });

  let plotDataset = [];
  Object.keys(chart.datasets).forEach((category) => {
    Object.keys(chart.datasets[category]).forEach((serie) => {
      plotDataset.push(chart.datasets[category][serie]);
    });
  });
  return {
    ...chart,
    datasets: plotDataset
  };
};
