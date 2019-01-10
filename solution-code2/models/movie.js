const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MovieSchema = Schema({
  title: String,
  plot: String,
  genre: String,
  actors: [{ type : Schema.Types.ObjectId, ref: 'Celebrity' }]
});

const Movie = mongoose.model('Movie', MovieSchema);

module.exports = Movie;
