const express = require('express');
const { movies } = require('./movies');
const logReq = require('./middlewareLogReq')

const PORT = 5000;
const app = express();

app.use('/', logReq);

//// parse form data, json
app.use(express.urlencoded({ extended: false }));
app.use(express.json())

//homepage
app.use(express.static('./addData'));

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

app.post('/api/movie/add', (req, res) => {
    let title = ''
    if (req.body.title) { title = req.body.title }
    else { return res.status(400).send("<h3>Please provide a title.</h3></bg><a href='/'>Back</a>") }
    let watched = req.body.watched ? true : false
    const newMovies = [...movies, { id: movies[movies.length-1].id + 1, title: title, watched: watched}]
    console.log(newMovies)
    let output = ''
    for (i=0; i<newMovies.length; i++){
        output += `${newMovies[i].title} <br />`
        }

    res.status(201).send(
        `<h3>${title} added successfully</h3><a href='/'>Back</a>. </br>All titles:</br> ${output}`)
   
})

//only works in Postman?
app.delete('/deleteMovie/:id', (req, res) => {
    const deletedMovieID = req.params.id;
    const newMovies = movies.filter(
        movie => movie.id !== Number(deletedMovieID)
        )
    console.log(newMovies)
    
    if (movies.length === newMovies.length) {
        return res
                .status(400)
                .send(`no movie with id ${deletedMovieID}`)
    }
    return res.status(200).send(`<h3>Successfully deleted movie N:${deletedMovieID}.</h3>`)
})

//wrong requests
app.all('*', (req, res) => {

    res.status(404).send('<h3>Resourse not found</h3>')
})

app.listen(PORT, (err) => {
    if (err) {
        console.log(err)
    }
    console.log(`app listening on ${PORT}`)
});