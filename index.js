const fs = require('file-system');
const dateFns = require('date-fns');

const time = new Date();

// Run midnightCronJob on the database and create array of outgoing reports
const outgoingReports = [
  {
    name: 'Report 1',
    publishedDate: dateFns.addSeconds(time, 1),
    questions: [ 'Question 1', 'Question 2', 'Question 3' ]
  },
  {
    name: 'Report 2',
    publishedDate: dateFns.addSeconds(time, 2),
    questions: [ 'Question 1', 'Question 2', 'Question 3' ]
  },
  {
    name: 'Report 3',
    publishedDate: dateFns.addSeconds(time, 3),
    questions: [ 'Question 1', 'Question 2', 'Question 3' ]
  },
  {
    name: 'Report 4',
    publishedDate: dateFns.addSeconds(time, 4),
    questions: [ 'Question 1', 'Question 2', 'Question 3' ]
  }
]

// Queue the outgoing reports in a staging file using Node's file system module.
const stringifyQueue = JSON.stringify(outgoingReports)
fs.writeFile('staging.js', stringifyQueue);



// Run a cron job every 15 minutes and read the staging file.
let cronTime = dateFns.addSeconds(time, 2)
setTimeout(() => {
  fs.readFile('staging.js', 'utf8', (err, data) => {
    const parsedQueue = JSON.parse(data);
    const publishReports = [];
    const stageReports = []

    // Loop through the reports, if publishedDate is less than or equal to current time push report to publishReports
    // array else if publishedDate is greater than current time push report to stageReports array
    
    parsedQueue.forEach(report => {
      const result = dateFns.compareDesc(report.publishedDate, cronTime);
      if (result >= 0) {
        publishReports.push(report);
      } else {
        stageReports.push(report);
      }
    });

    // Publish reports that are due to be published
    console.log(publishReports);

    fs.truncate('staging.js', () => {
      // Stage reports that are not due to be published
      const stringifyQueue = JSON.stringify(stageReports)
      fs.writeFile('staging.js', stringifyQueue);
    });
  });
}, 5000);