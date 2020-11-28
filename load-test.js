const axios = require("axios");
const ss = require("simple-statistics");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const fs = require("fs");
const { start } = require("repl");
const stats = [];
const errStats = [];
let durationCount = 0;
const argv = yargs(hideBin(process.argv)).argv;
const startLoad = (url, method, body, rate, duration) => {
  const recordFunction = (startTime) => (data) => {
    stats.push(Date.now() - startTime);
  };
  const postBody = fs.readFileSync(body);
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
        data: postBody,
        headers: {
          "content-type": "application/json",
        },
        timeout: 300,
      })
        .then(recordFunction(Date.now()))
        .catch((err) => {
          errStats.push(err);
        });
    }
  }, 1000);
};
const concurrencyModel = (url, method, body, concurrency, duration) => {
  const postBody = fs.readFileSync(body);
  const startTime = Date.now();
  let movingStartTime = startTime;
  const interval = setInterval(function(){logResults(false)}, 2000)
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
      console.log('Errored Responses code', errStats);
    } else {
      timeElapsed = Date.now() - movingStartTime;
      movingStartTime = Date.now();
      console.log("Total Successful response", movingStats.length);
      console.log(
        "Response per second",
        movingStats.length / (timeElapsed / 1000)
      );
      console.log("Response Time", {
        min: movingStats.length ? ss.min(movingStats): 0,
        max: movingStats.length ? ss.max(movingStats): 0,
        median: movingStats.length ? ss.median(movingStats): 0,
        p95: movingStats.length ? ss.quantile(movingStats, 0.95): 0,
        p99: movingStats.length ? ss.quantile(movingStats, 0.99): 0,
      });
      console.log('Errored Responses code', errStats);
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
      clearInterval(interval)
      logResults(true)
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
      timeout: 350,
    })
      .then(recordFunction(Date.now()))
      .catch((err) => {
        errStats.push(err.code);
        createHttp()
      });
  };
  for (let i = 0; i < concurrency; i++) {
    createHttp();
  }
};

if (argv.concurrencyModel) {
  if (
    argv.url &&
    argv.method &&
    argv.body &&
    argv.concurrency &&
    argv.duration
  ) {
    concurrencyModel(
      argv.url,
      argv.method,
      argv.body,
      argv.concurrency,
      argv.duration
    );
  } else {
    console.error("pass proper args");
  }
}
if (argv.rateModel) {
  if (argv.url && argv.method && argv.body && argv.rate && argv.duration) {
    startLoad(argv.url, argv.method, argv.body, argv.rate, argv.duration);
  } else {
    console.log({ argv });
    console.error("pass proper args");
  }
}
//startLoad("http://localhost:7000/sections", "get", {}, 10, 5);
//concurrencyModel("http://localhost:7000/sections", "get", {}, 10, 5);
