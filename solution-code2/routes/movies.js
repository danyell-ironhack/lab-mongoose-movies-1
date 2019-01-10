var express = require('express');
var router = express.Router();

const Celebrity = require('../models/celebrity');
const Movie = require('../models/movie');

/* GET home page. */
router.get('/movies', function(req, res, next) {
  Movie.find({}, (err, moviesArray) => {
    if (err) { return next(err); }

    res.render('movies/index', {
      title: 'Movies',
      movies: moviesArray
    });
  });
});

router.get('/movies/new', function(req, res, next) {
  res.render('movies/new', {
    title: "Create a New Movie"
  });

});


router.post('/movies', function(req, res, next) {
  const theMovie = new Movie ({
    title: req.body.title,
    plot: req.body.plot,
    genre: req.body.genre,
  });

  theMovie.save ((err) => {
    if (err) {
      res.render('celebrities/new', {
        title: "Create a New Movie"
      });
    }
    else {
      res.redirect('/movies');
    }
  })
});

router.get('/movies/:id', function (req, res, next) {
  Movie.findOne({_id: req.params.id}).populate('actors').exec(function (err, theMovie) {
    if (err) { return next(err); }
    res.render('movies/show', {
      title: `${theMovie.name} Details`,
      movie: theMovie
    });
  });

});

router.get('/movies/:id/addceleb', function (req, res, next) {
  Movie.findOne({_id: req.params.id}).populate('actors').exec(function (err, theMovie) {
    if (err) { return next(err); }
    res.render('movies/addceleb', {
      title: `${theMovie.name} - Add Celebrity`,
      movie: theMovie
    });
  });
});

router.post('/movies/:id/addceleb', function (req, res, next) {
  Movie.findOne({_id: req.params.id}).populate('actors').exec(function (err, theMovie) {
    if (err) { return next(err); }
    // Add celebrity ref to this movie
    Celebrity.findOne({name: req.body.celeb_name}, (err, theCeleb) => {
      if (err) { return next(err); }
      let mvCelebArray = theMovie.actors;
      mvCelebArray.push(theCeleb._id);
      const updatedMovie = {
        actors: mvCelebArray
      }
      Movie.update({_id: req.params.id}, updatedMovie, (err, theMovie) => {
        if (err) {return next(err); }
        res.redirect('/movies/' + req.params.id);
      });
    });
  });
});

router.get('/movies/:id/removeceleb/:id2', function (req, res, next) {
  Movie.findOne({_id: req.params.id}).populate('actors').exec(function (err, theMovie) {
    if (err) { return next(err); }
  // Remove celebrity ref to this movie
    let mvCelebArray = theMovie.actors;
    for (let i = 0; i < mvCelebArray.length; i++) {
      if (mvCelebArray[i]._id == req.params.id2) {
        mvCelebArray.splice(i,1); break;
      }
    }

    const updatedMovie = {
      actors: mvCelebArray
    }
    Movie.update({_id: req.params.id}, updatedMovie, (err, theMovie) => {
      if (err) {return next(err); }
      res.redirect('/movies/' + req.params.id);
    });
  });
});

router.get('/movies/:id/edit', function (req, res, next) {
  Movie.findOne({ _id: req.params.id }, (err, theMovie) => {
    if (err) { return next(err); }

    res.render('movies/edit', {
      title: `Edit ${theMovie.name}`,
      movie: theMovie
    });
  });
});


router.post('/movies/:id', function (req, res, next) {
  const updatedMovie = {
    title: req.body.title,
    plot: req.body.plot,
    genre: req.body.genre,
  }
  Movie.update({_id: req.params.id}, updatedMovie, (err, theMovie) => {
    if (err) {return next(err); }

    res.redirect('/movies');
  });
});

router.post('/movies/:id/delete', function(req, res, next) {
  Movie.findOne({ _id: req.params.id }, (err, theMovie) => {
    if (err) { return next(err); }

    theMovie.remove((err) => {
      if (err) { return next(err); }

      res.redirect('/movies');
    });
  });
});






module.exports = router;
