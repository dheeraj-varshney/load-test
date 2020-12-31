const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
    const throughput = []
    const validResponse = []
    const erroredResponse = []
    const fileStream = fs.createReadStream('new.log');
    let writeStream = fs.createWriteStream('throughput.csv')
    let writeStream2 = fs.createWriteStream('responses.csv')
    let writeStream3 = fs.createWriteStream('error.csv')
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

  for await (const line of rl) {
    // Each line in input.txt will be successively available here as `line`.
    if(line.indexOf('Mean response/sec') >=0) {
        const splitLines = line.split(" ")
        let throughPutValue = splitLines[splitLines.length - 1]
        throughput.push(throughPutValue)
        
    }
    if(line.indexOf('Total Valid responses') >=0) {
        const splitLines = line.split(" ")
        let validResponseValue = splitLines[splitLines.length - 1]
        validResponse.push(validResponseValue)
    }
    if(line.indexOf('Errored Response count') >=0) {
        const splitLines = line.split(" ")
        let erroredResponseValue = splitLines[splitLines.length - 1]
        erroredResponse.push(erroredResponseValue)
    }
    
  }
  writeStream.write(throughput.join('\n'))
  writeStream2.write(validResponse.join('\n'))
  writeStream3.write(erroredResponse.join('\n'))
  writeStream.end()
  writeStream2.end()
  writeStream3.end()
}

processLineByLine();

