const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended:true }))

let notes = [
  {
    id: 1,
    content: "Esto es una nota",
    important: true,
  },
  {
    id: 2,
    content: "Esta es otra nota",
    important: true,
  },
  {
    id: 3,
    content: "Esto es una nota no importante",
    important: false
  },
  {
    id: 4,
    content: "Esto es otra nota pero no tan importante",
    important: false
  }
]

app.get('/', (req, res)=>{
  res.send("<h1>Hello World</h1>")
})

app.get('/api',(req, res)=>{
  res.json(notes)
})

app.get('/api/:id',(req,res)=>{
  res.json(notes.find(note => note.id == req.params.id ))
  res.status(200)
})

app.post('/api', (req, res)=>{
  notes.push(req.body)
  res.json(notes)
})

app.put('/api/:id', (req, res, next)=>{
  notes = notes.reduce((newNotes, note) => {
    if (note.id == req.params.id) {
      newNotes.push({...note, ...req.body})
      return newNotes
    }
    newNotes.push(note)
    return newNotes
  }, [])

  res.status(201)
  res.json(notes)
})


app.delete('/api/:id', (req, res)=>{
  notes = notes.filter(note => note.id != req.params.id )
  res.status(204)
  res.json(notes)
})

const PORT = process.env.PORT || 3001

app.listen(PORT, ()=>{
  console.log(`Aplicación iniciada en Puerto ${PORT}`)
})