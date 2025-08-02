const { initializeDatabase } = require("./db/db.connect");
const Movie = require("./model/movie.model");
const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());

initializeDatabase();

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

const newMovie = {
  title: "Chaava",
  releaseYear: 2025,
  genre: ["Action",],
  director: "xyz",
  actors: ["xyz"],
  language: "Hindi",
  country: "India",
  rating: 8.8,
  plot: "A conflict erupts between forest dwellers and authorities",
  awards: "National Film Award ",
  posterUrl: "https://example.com/chavva_poster.jpg",
  trailerUrl: "https://example.com/chavva_trailer.mp4",
};

const createMovie = async (newMovie) => {
  try {
    const movie = new Movie(newMovie);
    const saveMovie = await movie.save();
    return saveMovie
  } catch (error) {
    throw error;
  }
};

//createMovie(newMovie)

app.post("/movies", async (req, res) => {
  try{

    const savedMovie = await createMovie(req.body)
    res.status(201).json({message: "Movie added Successfully", newMovie: savedMovie})

  }catch(error){
    res.status(500).json({error: "Failed to add Movie"})
  }
})

const readMovieByTitle = async (movieTitle) => {
  try {
    const movie = await Movie.findOne({ title: movieTitle });
    return movie;
  } catch (error) {
    throw error;
  }
};

app.get("/movies/:title", async (req, res) => {
  try {
    const movie = await readMovieByTitle(req.params.title);
    if (movie) {
      res.json(movie);
    } else {
      res.status(404).json({ error: "movie not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movie" });
  }
});

//readMovieByTitle("Dilwale Dulhania Le Jayenge")

const readAllMovies = async () => {
  try {
    const allMovies = await Movie.find();
    return allMovies;
  } catch (error) {
    throw error;
  }
};

app.get("/movies", async (req, res) => {
  try {
    const allMovies = await readAllMovies();
    if (allMovies.length != 0) {
      res.json(allMovies);
    } else {
      res.status(404).json({ error: "Movies not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch the movies" });
  }
});
//readAllMovies()

const readMovieByDirector = async (directorName) => {
  try {
    const movieByDirector = await Movie.find({ director: directorName });
    return movieByDirector;
  } catch (error) {
    throw error;
  }
};

app.get("/movies/director/:directorName", async (req, res) => {
  try {
    const movies = await readMovieByDirector(req.params.directorName);
    if (movies.length != 0) {
      res.json(movies);
    } else {
      res.status(404).json({ error: "Movies not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch the movies" });
  }
});

//readMovieByDirector("Kabir Khan")

async function readMovieByGenre(genreName) {
  try {
    const movieByGenre = await Movie.find({ genre: genreName });
    return movieByGenre;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

app.get("/movies/genres/:genreName", async (req, res) => {
  try {
    const movies = await readMovieByGenre(req.params.genreName);
    if (movies.length !== 0) {
      res.json(movies);
    } else {
      res.status(404).json({ error: "No movies found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movies." });
  }
});

const updateMovie = async (movieId, dataToUpdate) => {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(movieId, dataToUpdate, {
      new: true,
    });
    return updatedMovie;
  } catch (error) {
    throw error;
  }
};

app.post("/movies/:movieId", async (req, res) => {
  try{

    const updatedData = await updateMovie(req.params.movieId, req.body)
    if(updatedData){
      res.status(200).json({message: "Movie Updated Successfully", newUpdatedData: updatedData})
    }else{
      res.status(404).json({error: "Movie not found"})
    }

  }catch(error){
    res.status(500).json({error: "Failed To Update"})
  }
})

//updateMovie("6870d43d623c642162f15581", {rating: 9.5})

const updateMovieDeatils = async (movieTitle, dataToUpdate) => {
  try {
    const updatedMovie = await Movie.findOneAndUpdate(
      { title: movieTitle },
      dataToUpdate,
      { new: true }
    );
    console.log(updatedMovie);
  } catch (error) {
    throw error;
  }
};

//updateMovieDeatils("Dilwale Dulhania Le Jayenge", {rating: 9.7})

const deleteMovieById = async (movieId) => {
  try {
    const deleteMovie = await Movie.findByIdAndDelete(movieId);
    return deleteMovie
  } catch (error) {
    throw error;
  }
};

app.delete("/movies/:movieId", async (req, res) => {
  try{

    const deletedData = await deleteMovieById(req.params.movieId)

    if(deletedData){
      res.status(200).json({message: "Data deleted successfully"})
    }

    

  }catch(error){
   res.status(500).json({error: "Failed to delete"})
  }
})

//deleteMovieById("68724b763e0b8a9ab126513a")

const deleteMovieByTitle = async (movieTitle) => {
  try {
    const deleteMovie = await Movie.findOneAndDelete({ title: movieTitle });
    console.log("This movie was deleted", deleteMovie);
  } catch (error) {
    throw error;
  }
};

//deleteMovieByTitle("Chaava")

const PORT = 3000;
app.listen(PORT, () => {
  console.log("server is running on PORT", PORT);
});
