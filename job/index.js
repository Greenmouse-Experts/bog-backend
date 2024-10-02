require('dotenv/config');
const Agenda = require('agenda');
const dayjs = require('dayjs');

const mongoConnectionString = process.env.MONGO_AGENDA_URI;

const jobQueue = new Agenda({
  db: { address: mongoConnectionString, collection: 'jobs' },
});

jobQueue.define('instantJob', async (job) => {
  const data = job?.attrs?.data;
  console.log(
    'This job is running as soon as it was received. This is the data that was sent:'
  );
  console.log(data);
});

jobQueue.define('delayedJob', async (job) => {
  const data = job?.attrs?.data;
  console.log(
    'This job is running after a 5 second delay. This is the data that was sent:'
  );
  console.log(data);
});

jobQueue.start();

module.exports = jobQueue;

// module.exports = function(app) {
//   app.post('/api/jobs/create', (req, res) => {
//     const jobType = req?.query?.jobType;
//     const allowedJobs = Object.keys(jobQueue._definitions);

//     if (!jobType) {
//       return res.send('Must pass a jobType in the query params.');
//     }

//     if (!allowedJobs.includes(jobType)) {
//       return res.send(
//         `${jobType} is not supported. Must pass one of ${allowedJobs.join(
//           ', or '
//         )} as jobType in the query params.`
//       );
//     }

//     if (jobType === 'instantJob') {
//       jobQueue.now(req?.query?.jobType, req.body);
//     }

//     if (jobType === 'delayedJob') {
//       jobQueue.schedule(
//         dayjs()
//           .add(20, 'seconds')
//           .format(),
//         req?.query?.jobType,
//         req.body
//       );
//     }

//     res.send('Job added to queue!');
//   });
// };
