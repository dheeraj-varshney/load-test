const axios = require("axios");
const ss = require("simple-statistics");
const stats = [];
const errStats = [];
let durationCount = 0;

const startLoad = (url, method, body, rate, duration) => {
  const recordFunction = (startTime) => (data) => {
    stats.push(Date.now() - startTime);
  };
  const testStartTime = Date.now();
  const interval = setInterval(function () {
    durationCount++;
    if (durationCount > duration) {
      clearInterval(interval);
      console.log(
        "Mean response/sec",
        stats.length / ((Date.now() - testStartTime) / 1000)
      );
      console.log("Response Time", {
        min: ss.min(stats),
        max: ss.max(stats),
        median: ss.median(stats),
        p95: ss.quantile(stats, 0.95),
        p99: ss.quantile(stats, 0.99),
      });
      console.log("Total Successful Requests", stats.length);
      console.log("Errored Response", errStats.length);
      return;
    }
    for (let i = 0; i < rate; i++) {
      axios({
        method: method,
        url: url,
        data: body,
      })
        .then(recordFunction(Date.now()))
        .catch((err) => {
          errStats.push(err);
        });
    }
  }, 1000);
};
const concurrencyModel = (url, method, body, concurrency, duration) => {
  const stats = [];
  const errStats = [];
  const testStartTime = Date.now();
  let concurrentConnections = concurrency;
  const recordFunction = (startTime) => (data) => {
    stats.push(Date.now() - startTime);
    if ((Date.now() - testStartTime) / 1000 > duration) {
      concurrentConnections--;
      console.log(stats.length);
      console.log("Response Time", {
        min: ss.min(stats),
        max: ss.max(stats),
        median: ss.median(stats),
        p95: ss.quantile(stats, 0.95),
        p99: ss.quantile(stats, 0.99),
      });
      return;
    }
    createHttp();
  };
  const createHttp = function () {
    axios({
      method: method,
      url: url,
      data: body,
    })
      .then(recordFunction(Date.now()))
      .catch((err) => {
        errStats.push(err);
        concurrentConnections--;
      });
  };
  for (let i = 0; i < concurrency; i++) {
    createHttp();
  }
};
startLoad("http://localhost:7000/sections", "get", {}, 10, 5);
//concurrencyModel("http://localhost:7000/sections", "get", {}, 10, 5);
