require('dotenv/config');
const Agenda = require('agenda');
const dayjs = require('dayjs');
const User = require('../models/User');
const { postMessageEmail } = require('../helpers/mailer/samples');

const mongoConnectionString = process.env.MONGO_AGENDA_URI;

const jobQueue = new Agenda({
  db: { address: mongoConnectionString, collection: 'jobs' },
});

jobQueue.define('instantJob', async (job) => {
  const data = job?.attrs?.data;
  console.log(
    'This job is running as soon as it was received. This is the data that was sent:'
  );

  let where = { where: { userType: data.user } };
  if (data.user === 'product_partner') {
    where = { where: { userType: 'vendor' } };
  } else if (data.user === 'all' || data.user === null) {
    where = {};
  }

  // Fetch users by user
  const users = await User.findAll(where);

  // Process
  await processInBatches(users, 5, processItem, data);
});

exports.processInBatches = async (users, batchSize, data) => {
  for (let i = 0; i < users.length; i += batchSize) {
    const batch = users.slice(i, i + batchSize);
    console.log(i + 1 + ' batch');

    await Promise.all(
      batch.map(
        (item) =>
          new Promise(async (resolve) => {
            setTimeout(async () => {
              // Send email
              console.log('Sending content');
              await postMessageEmail(item, data.user, data);

              resolve();
            }, 2000);
          })
      )
    );
  }
};

async function processItem(item, resolve, data) {
  // return new Promise((resolve) => {
  // Simulating async work
  // });
}

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
