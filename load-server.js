const axios = require("axios");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const argv = yargs(hideBin(process.argv)).argv;

function startRequest(maxRequest, rate, url) {
    let totalRequest = 0;
    let totalResponse =0;
    let totalError = 0;
    let requestInterval = setInterval(() => {
        if(totalRequest < maxRequest) {
            for(let i =0;i<rate;i++) {
                totalRequest++;
                axios({
                    method: "post",
                    url: `http://internal-node-api-mock-532674101.us-east-1.elb.amazonaws.com/${url}`,
                    data: {
                        "siteId": 1,
                        "wlsId": 1,
                        "roundId": 23905,
                        "tourId": 1616,
                        "site": "cricket",
                        "contestDB": "voltdb4",
                        "roundCalcStatus": 0,
                        "pcStreamingStatus": 0,
                        "pcStack": "classic",
                        "isRoundComplete": 0,
                        "isRoundLocked": 0,
                        "isArchive": 0
                    },
                    headers: {
                      "content-type": "application/json",
                    },
                  })
                    .then(() => totalResponse++)
                    .catch((err) => {
                        totalError++
                      console.log(err)
                    });
            }
        }
        if(totalResponse === totalRequest || (totalResponse + totalError === totalRequest) || (totalError === totalRequest)) {
            clearInterval(requestInterval)
            console.log('waiting for responses')
        }
        console.log('total Request', totalRequest)
        console.log('total Response', totalResponse)
        console.log('total Error', totalError)
        console.log("***********************************")
    }, 1000)
}

if(argv.maxRequest && argv.rate && argv.url) {
    startRequest(argv.maxRequest, argv.rate, argv.url)
}