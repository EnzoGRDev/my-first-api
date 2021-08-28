require('dotenv').config()
require('./mongo.js')
const express = require('express')
const app = express()
const cors = require('cors')
const notesRouter = require('./controllers/notes')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
app.use(cors({
  origin : ["http://127.0.0.1:3000","http://localhost:3000"]
}))

app.use(express.json())

app.use(express.urlencoded({ extended:true }))

app.get('/', (req, res)=>{
  res.send(
    '<h1>Welcome To Api Notes</h1>')
})

app.use('/api/login', loginRouter) 

app.use('/api/notes', notesRouter)

app.use('/api/users', usersRouter)

app.use((req, res, next) => {
  res.status(503).end()
})

app.use((err, req, res, next)=>{
  if(err.name === 'CastError'){
    res.status(400).end()
  }
  else if (err.name === 'SyntaxError'){
    res.status(400).end()
  } 
  else if (err.name === 'TypeErorr'){
    res.status(400).end()
  }
  else if (err.name === 'JsonWebTokenError'){
    res.status(401).end()
  }else{
    console.log(err.name)
    res.status(503).end()
  }
})

const PORT = process.env.PORT || 3001

app.listen(PORT, ()=>{
  console.log(`Aplicación iniciada en Puerto ${PORT}`)
})