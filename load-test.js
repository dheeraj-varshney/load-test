const axios = require("axios");
const ss = require("simple-statistics");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const fs = require("fs");
const blocked = require("blocked");
const stats = [];
const errStats = [];
let movingResponseCount = 0;
const responsesEachSeconds = [];
let durationCount = 0;
let isRateConstant = false;
const argv = yargs(hideBin(process.argv)).argv;
const EVLD = blocked(
  function (delay) {
    console.log(`Event loop delay ${delay}`);
  },
  { threshold: 1, interval: 1000 }
);

const httpAgent = new http.Agent({ keepAlive: true });
const httpsAgent = new https.Agent({ keepAlive: true });

const instance = axios.create({
  httpAgent,  // httpAgent: httpAgent -> for non es6 syntax
  httpsAgent,
});

const startLoad = (url, method, body, rate, duration, rampDuration) => {
  let currentRate = 10;
  const speed = Math.ceil((rate - currentRate) / rampDuration);
  let count = 0;
  const recordFunction = (startTime) => (data) => {
    count--;
    if (isRateConstant) {
      stats.push(Date.now() - startTime);
      movingResponseCount++;
    }
  };
  const postBody = fs.readFileSync(body);
  const testStartTime = Date.now();
  const createRequest = () =>
    axios({
      method: method,
      url: url,
      data: postBody,
      headers: {
        "content-type": "application/json",
      },
      httpAgent
    })
      .then(recordFunction(Date.now()))
      .catch((err) => {
        errStats.push(err);
        count--;
      });
  const interval = setInterval(function () {
    durationCount++;
    console.log("Active Connections", count);
    if (isRateConstant) {
      console.log("Number of Responses this second", movingResponseCount);
      responsesEachSeconds.push(movingResponseCount);
      movingResponseCount = 0;
    } else {
      console.log("stats", stats);
    }
    if (durationCount > duration && count <= 0) {
      clearInterval(interval);
      console.log(
        "Mean response/sec",
        stats.length / ((Date.now() - testStartTime) / 1000)
      );
      console.log("Response latency", {
        min: ss.min(stats),
        max: ss.max(stats),
        median: ss.median(stats),
        p95: ss.quantile(stats, 0.95),
        p99: ss.quantile(stats, 0.99),
      });
      console.log("Responses per second", {
        min: ss.min(responsesEachSeconds),
        max: ss.max(responsesEachSeconds),
        median: ss.median(responsesEachSeconds),
        p95: ss.quantile(responsesEachSeconds, 0.95),
        p99: ss.quantile(responsesEachSeconds, 0.99),
        variance: ss.variance(responsesEachSeconds),
      });
      console.log("Total Successful response", stats.length);
      console.log("Errored Response count", errStats.length);
      console.log("Errored Response", errStats[0]);
      console.log("Active connections", count);
      return;
    }
    if (durationCount <= duration) {
      for (let i = 0; i < currentRate; i++) {
        count++;
        createRequest();
      }
    } else {
      console.log("total response", stats.length);
      console.log("total errors", errStats.length);
      console.log("Responses per second (still waiting for pending requests......)", {
        min: ss.min(responsesEachSeconds),
        max: ss.max(responsesEachSeconds),
        median: ss.median(responsesEachSeconds),
        p95: ss.quantile(responsesEachSeconds, 0.95),
        p99: ss.quantile(responsesEachSeconds, 0.99),
        variance: ss.variance(responsesEachSeconds),
      });
    }
    // Ramp up
    if (currentRate < rate) {
      currentRate += speed;
    } else {
      isRateConstant = true;
    }
  }, 1000);
};
const concurrencyModel = (url, method, body, concurrency, duration) => {
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
  if (
    argv.url &&
    argv.method &&
    argv.body &&
    argv.rate &&
    argv.duration &&
    argv.rampDuration
  ) {
    if (argv.rate < 10 && argv.duration < argv.rampDuration) {
      console.error("pass proper args");
    } else {
      startLoad(
        argv.url,
        argv.method,
        argv.body,
        argv.rate,
        argv.duration,
        argv.rampDuration
      );
    }
  } else {
    console.log({ argv });
    console.error("pass proper args");
  }
}
//startLoad("http://localhost:7000/sections", "get", {}, 10, 5);
//concurrencyModel("http://localhost:7000/sections", "get", {}, 10, 5);
