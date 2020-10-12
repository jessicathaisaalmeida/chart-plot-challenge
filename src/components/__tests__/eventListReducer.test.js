const reducer = require("./../eventListReducer.js");

it("should operate a start event", () => {
  const initialChart = {
    series: [],
    labels: [],
    categories: [],
    datasets: {},
    begin: 1,
    end: 2,
    isStopped: false
  };
  const event = {
    type: "start",
    timestamp: 1,
    select: ["select1", "select2"],
    group: ["group1", "group2"]
  };

  const chart = reducer.reduceStartEvent.operate(event, initialChart);

  expect(chart).toStrictEqual({
    series: ["select1", "select2"],
    labels: [],
    categories: ["group1", "group2"],
    datasets: {},
    begin: 1,
    end: 1,
    isStopped: false
  });
});

it("should have 8 different lines when there are two different values 2 groups", () => {
  //if there are two different values for os and two different values for browser,
  //we should have 8 different lines plotted

  const events = [
    {
      type: "start",
      timestamp: 1,
      select: ["select1", "select2"],
      group: ["group1", "group2"]
    },
    {
      type: "span",
      timestamp: 1,
      begin: 0,
      end: 10
    },
    {
      type: "data",
      timestamp: 1,
      select1: "a",
      select2: "b",
      group1: "x",
      group2: "y"
    },
    {
      type: "data",
      timestamp: 2,
      select1: "a",
      select2: "c",
      group1: "x",
      group2: "y"
    },
    {
      type: "data",
      timestamp: 3,
      select1: "d",
      select2: "b",
      group1: "x",
      group2: "y"
    },
    {
      type: "data",
      timestamp: 4,
      select1: "d",
      select2: "c",
      group1: "x",
      group2: "y"
    },
    {
      type: "data",
      timestamp: 5,
      select1: "a",
      select2: "b",
      group1: "x",
      group2: "z"
    },
    {
      type: "data",
      timestamp: 5,
      select1: "a",
      select2: "c",
      group1: "w",
      group2: "y"
    },
    {
      type: "data",
      timestamp: 5,
      select1: "d",
      select2: "b",
      group1: "w",
      group2: "z"
    }
  ];

  const dataChart = reducer.reduceEventsInDataChart(events);

  expect(dataChart.datasets.length).toStrictEqual(8);
});

it("should ignore entrees after stop", () => {
  const events = [
    {
      type: "start",
      timestamp: 1,
      select: ["select1", "select2"],
      group: ["group1", "group2"]
    },
    {
      type: "span",
      timestamp: 1,
      begin: 0,
      end: 10
    },
    {
      type: "data",
      timestamp: 1,
      select1: "a",
      select2: "b",
      group1: "x",
      group2: "y"
    },
    {
      type: "data",
      timestamp: 2,
      select1: "a",
      select2: "c",
      group1: "x",
      group2: "y"
    },
    {
      type: "data",
      timestamp: 3,
      select1: "d",
      select2: "b",
      group1: "x",
      group2: "y"
    },
    {
      type: "data",
      timestamp: 4,
      select1: "d",
      select2: "c",
      group1: "x",
      group2: "y"
    },
    {
      type: "stop",
      timestamp: 5
    },
    {
      type: "data",
      timestamp: 5,
      select1: "a",
      select2: "c",
      group1: "w",
      group2: "y"
    },
    {
      type: "data",
      timestamp: 5,
      select1: "d",
      select2: "b",
      group1: "w",
      group2: "z"
    }
  ];

  const dataChart = reducer.reduceEventsInDataChart(events);

  expect(dataChart.datasets.length).toStrictEqual(2);
});
