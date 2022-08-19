const express = require('express');
const { movies } = require('./movies');
const logReq = require('./middlewareLogReq')

const PORT = 5000;
const app = express();

app.use('/api', logReq);

//form for the post request to do
app.use(express.urlencoded({ extended: false }));
app.use(express.static('./addData'));

app.get('/', (req, res) => {
    res.send("homepage");
})

app.get('/api/movies', (req, res) => {
    const fetchedMovies = movies.map((movie) => {
    const { id, title, watched } = movie
        return { id, title, watched }
    })

    res.json(fetchedMovies);
})

app.get('/api/movie/:id', (req, res) => {
    const movieID = req.params.id;
    
    const singleMovie = movies.find(
        movie => movie.id === Number(movieID)
    )

    if (!singleMovie) {
        return res.status(404).send('<h3>Resourse not found</h3>')
    }
    return res.json(singleMovie)
})

app.post('/newMovie', (req, res) => {
    let title = ''
    if (req.body.title) { title = req.body.title }
    else { return res.status(400).send("<h3>Please provide title.</h3></bg><a href='/'>Back</a>") }
    let watched = req.body.watched ? true : false
    const newMovies = [...movies, { id: movies[movies.length-1].id + 1, title: title, watched: watched}]
    res.status(201).send("<h3>added successfully</h3></bg><a href='/'>Back</a>")
    console.log(newMovies)
})

//delete req to do

//other
app.all('*', (req, res) => {
    res.status(404).send('<h3>Resourse not found</h3>')
})

app.listen(PORT, (err) => {
    if (err) {
        console.log(err)
    }
    console.log(`app listening on ${PORT}`)
});