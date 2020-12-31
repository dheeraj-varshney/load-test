const axios = require("axios");
const ss = require("simple-statistics");
const fs = require("fs");

module.exports  = (url, method, body, concurrency, duration) => {
  let stats = [];
  let errStats = [];
  const postBody = fs.readFileSync(body);
  const startTime = Date.now();
  let movingStartTime = startTime;
  const interval = setInterval(function () {
    logResults(false);
  }, 2000);
  const logResults = (isFinal) => {
    let timeElapsed = 0;
    if (isFinal) {
      timeElapsed = Date.now() - startTime;
      console.log("Total Successful response", stats.length);
      console.log("Response per second", stats.length / (timeElapsed / 1000));
      console.log("Response Time", {
        min: ss.min(stats),
        max: ss.max(stats),
        median: ss.median(stats),
        p95: ss.quantile(stats, 0.95),
        p99: ss.quantile(stats, 0.99),
      });
      console.log("Errored Responses code", errStats);
    } else {
      timeElapsed = Date.now() - movingStartTime;
      movingStartTime = Date.now();
      console.log("Total Successful response", movingStats.length);
      console.log(
        "Response per second",
        movingStats.length / (timeElapsed / 1000)
      );
      console.log("Response Time", {
        min: movingStats.length ? ss.min(movingStats) : 0,
        max: movingStats.length ? ss.max(movingStats) : 0,
        median: movingStats.length ? ss.median(movingStats) : 0,
        p95: movingStats.length ? ss.quantile(movingStats, 0.95) : 0,
        p99: movingStats.length ? ss.quantile(movingStats, 0.99) : 0,
      });
      console.log("Errored Responses code", errStats);
      movingStats = [];
    }
  };
  let movingStats = [];
  const stats = [];
  const errStats = [];
  const testStartTime = Date.now();
  let concurrentConnections = concurrency;
  const recordFunction = (startTime) => (data) => {
    const timeElapsed = Date.now() - startTime;
    stats.push(timeElapsed);
    movingStats.push(timeElapsed);
    if ((Date.now() - testStartTime) / 1000 > duration) {
      concurrentConnections--;
      clearInterval(interval);
      logResults(true);
      return;
    }
    createHttp();
  };
  const createHttp = function () {
    axios({
      method: method,
      url: url,
      data: postBody,
      headers: {
        "content-type": "application/json",
      },
    })
      .then(recordFunction(Date.now()))
      .catch((err) => {
        errStats.push(err.code);
        createHttp();
      });
  };
  for (let i = 0; i < concurrency; i++) {
    createHttp();
  }
};
