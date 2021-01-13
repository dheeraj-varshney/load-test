const axios = require("axios");
const ss = require("simple-statistics");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const fs = require("fs");
const blocked = require("blocked");
const argv = yargs(hideBin(process.argv)).argv;

blocked(
  function (delay) {
    console.log(`Event loop delay ${delay}`);
  },
  { threshold: 1, interval: 1000 }
);
const isValidResponse = (response) =>
  response && response.data && !response.data.errors;

const startLoad = (url, method, body, rate, duration, logInterval) => {
  let stats = [];
  let errStats = [];
  let durationCount = 0;
  let activeConnection = 0;
  let response = {};
  let validResponses = 0;
  const rates = rate.split(",");
  let testIndex = 0;
  const recordFunction = (startTime) => (data) => {
    activeConnection--;
    stats.push(Date.now() - startTime);
    if (isValidResponse(data)) {
      validResponses++;
    }
    response = data;
  };
  const postBody = fs.readFileSync(body);
  let testStartTime = Date.now();
  const createRequest = () =>
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
        errStats.push(err);
        activeConnection--;
      });

  const dataLogger = setInterval(function () {
    console.dir(
      response && response.data
        ? response.data
        : response
        ? response.headers
        : "response undefined",
      {
        depth: null,
      }
    );
    console.log("Errored Response count", errStats.length);
    console.log("Errored Response", errStats[0]);
  }, 5000);
  const interval = setInterval(function () {
    durationCount++;
    console.log("Active Connections", activeConnection);
    if (durationCount > duration && activeConnection <= 0) {
      if (testIndex >= rates.length - 1) {
        clearInterval(interval);
        clearInterval(dataLogger);
      }
      testIndex++;
      durationCount = 0;
      console.log(`test no. ${testIndex} is complete`);
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
      console.log("Total Successful responses", stats.length);
      console.log("Total Valid responses", validResponses);
      console.log("Errored Response count", errStats.length);
      console.log("Errored Response", errStats[0]);
      console.log("Active connections", activeConnection);
      stats = [];
      errStats = [];
      validResponses = 0;
      testStartTime = Date.now();
    }
    if (durationCount <= duration) {
      for (let i = 0; i < Number(rates[testIndex]); i++) {
        activeConnection++;
        createRequest();
      }
    } else {
      console.log("total response", stats.length);
      console.log("total errors", errStats.length);
    }
  }, 1000);
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
    if (argv.rate < 10 && argv.duration < argv.rampDuration) {
      console.error("pass proper args");
    } else {
      const logDuration = argv.logInterval ? argv.logInterval : 1000;
      startLoad(argv.url, argv.method, argv.body, argv.rate, argv.duration);
    }
  } else {
    console.log({ argv });
    console.error("pass proper args");
  }
}
//startLoad("http://localhost:7000/sections", "get", {}, 10, 5);
//concurrencyModel("http://localhost:7000/sections", "get", {}, 10, 5);
