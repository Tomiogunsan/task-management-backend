const dotenv = require('dotenv');
const mongoose = require('mongoose');

const app = require('./app');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB)
  .then(() => {
    console.log('DB connection succesful!');
  })
  .catch((err) => console.error('MongoDB connection error: ', err));

// socket.emit('joinTeam', teamId);

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});

module.exports = server;

//    {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useFindAndModify: false,
//   useUnifiedTopology: true,
// }
