const dotenv = require('dotenv');
const mongoose = require('mongoose');
const socketio = require('socket.io');

const app = require('./app');

const catchAsync = require('./utils/catchAsync');
const User = require('./models/userModel');
const Team = require('./models/teamModel');
const Message = require('./models/messageModel');

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

const io = socketio(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('joinTeam', (teamId) => {
    if (!mongoose.Types.ObjectId.isValid(teamId)) {
      console.error('Invalid teamId');
      return;
    }
    socket.join(teamId);
    console.log(`User joined room: ${teamId}`);
  });

  socket.on(
    'sendMessage',
    catchAsync(async (data) => {
      const { content, teamId, userId } = data;
      const team = await Team.findById(teamId);
      if (!team) {
        console.error('No team found');
        return;
      }
      const user = await User.findById(userId);
      if (!user) {
        console.error('No user found');
        return;
      }
      const teamMember = team.members.includes(user._id);
      console.log('team', teamMember);
      if (user.role !== 'admin' && !teamMember) {
        console.error('User is not part of the team');
        return;
      }
      const message = await Message.create({
        content,
        team: teamId,
        sender: userId,
      });
      console.log('Emitting message to team:', teamId);
      io.to(teamId).emit('receiveMessage', message);
      console.log('Message sent:', message);
    }),
  );

  socket.on('disconnect', () => {
    console.log('Client disconnected', socket.id);
  });
});

//    {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useFindAndModify: false,
//   useUnifiedTopology: true,
// }

module.exports = io;
