const axios = require("axios");
const http = require("http");
const ss = require("simple-statistics");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const blocked = require("blocked");
const loadConfig = require("./load-config");
const payload = require("./payload");

let stats = [];
let errStats = [];
let durationCount = 0;

const argv = yargs(hideBin(process.argv)).argv;
const EVLD = blocked(
  function (delay) {
    console.log(`Event loop delay ${delay}`);
  },
  { threshold: 1, interval: 1000 }
);

const createRequest = async (url, method, postBody) =>
  axios({
    method: method,
    url: url,
    data: postBody,
    headers: {
      "content-type": "application/json",
      "Cookie": "ajs_anonymous_id=%2286af43bb-5e00-4cd2-8255-2ccf92bafedd%22; WZRK_G=775da19b01524940b53caff859541c59; _ga=amp-H8eiH9g1yFARZU_jE3mq0w; G_ENABLED_IDPS=google; __csrf=hsvtm; connect.sid=s%3AI5vgVKhdyELwu5H6ZvzYcBuSH_qFw_cT.JUuce2CGUxXHp%2BcVZUWZK6GSx4hkbWJfyNdixGSCRS4; IPL_Offer=variant3; dh_user_id=50155f00-1ab6-11eb-8436-95acf3119b5b",
      "If-None-Match": 'dream_team{"site":"cricket","roundId":23905,"siteId":1,"wlsId":1}-->W/"3b63-6RK16vshFX02XzcIRooT+G4M0OM"match{"roundId":23905,"site":"cricket","siteId":1,"wlsId":1}-->W/"f85-XDj8dWz0RxCvnncNZbfI6yHZNBU"my_teams_v2{"tourId":1616,"roundId":23905,"site":"cricket","siteId":1,"wlsId":1}-->W/"97e-Qq7fQWKvInipFJHx+Uaqa2j2SQo"player{"roundId":23905}-->W/"3b63-6RK16vshFX02XzcIRooT+G4M0OM"round_info{"roundId":23905,"site":"cricket","siteId":1,"wlsId":1}-->W/"1c03-g1aAKRGS0rodoVOfCep5rvGHftg"sites{"site":"cricket","slug":"cricket","slugs":["cricket"],"country":114,"siteId":1,"wlsId":1}-->W/"1144-99mPqT9KXPjHN3rMZ13chjX/kKo"squads{"roundId":23905,"site":"cricket","tourId":1616,"teamId":-1,"siteId":1,"wlsId":1}-->W/"791-pI+h4speqob1goxIfq2qMzfXBxw"'
    },
    // httpAgent: new http.Agent({ keepAlive: true }),
  });

const startLoad = (url, method, maxRate, duration, minMultiple) => {
  let pendingRequest = 0;
  let rate = 0;
  const allQueries = Object.keys(loadConfig);
  allQueries.forEach((query) => (rate += loadConfig[query]));
  let minRate = rate;
  rate = rate * minMultiple
  

  let testStartTime = Date.now();

  const recordResponse = (startTime) => (data) => {
    pendingRequest--;
    stats.push(Date.now() - startTime);
    let response = data;
    const validResponse = response && response.data && !response.data.errors;
    if (!validResponse) {
      console.log("Invalid Response", response.status);
      console.log(response)
      errStats.push(response);
    }
  };

  const printOutput = (rate) => {
    console.log("***********************************");
    console.log(`rate ${rate} is complete`);
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
    console.log("Total Successful response", stats.length);
    console.log("Errored Response count", errStats.length);
    console.log("Errored", errStats[0]);
    console.log("***********************************");
  };

  const increaseLoad = (durationCount, duration, pendingRequest) => {
    if (durationCount > duration && pendingRequest <= 0) {
      printOutput(rate);
      return true;
    }
    return false;
  };

  const interval = setInterval(async () => {
    durationCount++;
    if (increaseLoad(durationCount, duration, pendingRequest)) {
      rate = rate + minRate;
      durationCount = 0;
      stats = [];
      errStats = [];
      testStartTime = Date.now()
      if (rate > maxRate) {
        clearInterval(interval);
      }
    } else {
      if (durationCount <= duration) {
        for (let i = 0; i < allQueries.length; i++) {
          const query = allQueries[i];
          console.log(
            `Hitting ${query} ${
              loadConfig[query] * (rate / minRate)
            } number of times`
          );
          
          for (let j = 0; j < loadConfig[query] * (rate / minRate); j++) {
            pendingRequest++;
            let postBody = payload[query];
            const partialRecord = recordResponse(Date.now())
            createRequest(url, method, postBody)
              .then(partialRecord)
              .catch((err) => {
                if(err.response.status === 304) {
                  partialRecord({status: 304, data: {}})
                } else {
                  errStats.push(err);
                  pendingRequest--;
                }
              });
          }
          console.log('Request finished.')
          console.log("***********************");
        }
      } else {
        console.log(`Rate ${rate} Waiting for response`);
        console.log(`Pending request ${pendingRequest}`);
        console.log('Error count', errStats.length);
        console.log("***********************");
      }
    }
  }, 1000);
};

if (argv.url && argv.method && argv.maxRate && argv.duration && argv.minMultiple) {
  startLoad(argv.url, argv.method, argv.maxRate, argv.duration, argv.minMultiple);
} else {
  console.log({ argv });
  console.error("pass proper args");
}

// startLoad("http://localhost:7000/sections", "get", {}, 40, 2, 2);
