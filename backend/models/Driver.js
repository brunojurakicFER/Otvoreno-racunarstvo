const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  founded_year: {
    type: Number,
    required: true
  },
  championships_won: {
    type: Number,
    required: true
  }
});

const DriverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  },
  nationality: {
    type: String,
    required: true
  },
  wins: {
    type: Number,
    required: true
  },
  podiums: {
    type: Number,
    required: true
  },
  poles: {
    type: Number,
    required: true
  },
  points: {
    type: Number,
    required: true
  },
  championships: {
    type: Number,
    required: true
  },
  races_done: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'retired'],
    required: true
  },
  current_team: {
    type: TeamSchema,
    required: false
  }
}, {collection: 'drivers_with_teams'});

module.exports = mongoose.model('Driver', DriverSchema);
