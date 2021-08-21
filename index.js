require('dotenv').config()
require('./mongo.js')
const express = require('express')
const app = express()
const cors = require('cors')
const Note = require('./models/Note.js')


app.use(cors({
  "origin" : '*',
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE"
}))
app.use(express.json())
app.use(express.urlencoded({ extended:true }))


app.get('/', (req, res)=>{
  res.send(
    '<h1>Welcome To Api Notes</h1>')
})

app.get('/api/notes',(req, res, next)=>{
  Note.find({})
    .then(notes => res.json(notes))
    .catch(err => next(err))
})

app.get('/api/notes/:id',(req, res, next)=>{
  const { id } = req.params

  Note.findById(id)
    .then( note => note ? res.json(note) : res.status(404).end())  
    .catch( err => next(err))
})

app.post('/api/notes', (req, res)=>{
  if (!req.body.content) {
    return response.status(404).json({
      error: 'required "content" field is missing'
    }).end()
  }
  const note = new Note({
    content: req.body.content,
    date: new Date(),
    important: req.body.important || false
  })
  
  note.save()
    .then(savedNote => {
      res.json(savedNote)
      res.status(201)
    })
    .catch(err => console.log(err))
  
})

app.put('/api/notes/:id', (req, res, next)=>{
  let {content = null, important = null} = {} = req.body
  const {id} =  req.params 

  if (important === false || important === true  ) ""
  else important = null
  
  if (typeof(content === 'string')) ""
  else content = null 

  if (content && important !== null ){
    Note.findByIdAndUpdate( id, {content: content, important: important}, {new: true})
      .then(newNote => res.status(201).json(newNote))
        .catch(err => next(err))
  }
  else if(content && important === null){
    Note.findByIdAndUpdate(id, { content : content }, {new: true})
      .then(newNote => res.status(201).json(newNote))
        .catch(err => next(err)) 
  }
  else if(!content && important !== null){
    Note.findByIdAndUpdate(id, { important : important }, {new: true})      
      .then(newNote => res.status(201).json(newNote))
        .catch(err => next(err)) 

  }else res.status(400)
            .statusMessage("Se debe mandar al menos un contenido válido")
              .end() 
})


app.delete('/api/notes/:id', (req, res)=>{
  const {id} = req.params
  Note.findByIdAndDelete(id)
})

app.use((req, res, next) => {
  res.status(503).end()
})
app.use((err, req, res, next)=>{
  if(err.name === 'CastError'){
    res.status(400).end()
  }
  else if (err.name === 'TypeErorr'){
    res.status(400).end()
  } else{
    console.log(err.name)
    res.status(503).end()
  }
})

const PORT = process.env.PORT || 3001

app.listen(PORT, ()=>{
  console.log(`Aplicación iniciada en Puerto ${PORT}`)
})