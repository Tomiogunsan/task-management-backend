const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  description: {
    type: String,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  projects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
    },
  ],

  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
