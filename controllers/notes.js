const jwt = require('jsonwebtoken')
const dataVerify = require('../middlewares/dataVerify')
const userExtractor = require('../middlewares/userExtractor')
const notesRouter = require('express').Router()
const Note = require('../models/Note')
const User = require('../models/User')

notesRouter.get('/',(req, res, next)=>{
  Note.find({})
    .populate('user',{
      username:1,
      name:1
    })
      .then(notes => {
      notes
      res.json(notes)
      })
        .catch(err => next(err))
})

notesRouter.get('/:id',(req, res, next)=>{
  const { id } = req.params

  Note.findById(id)
    .then( note => note ? res.json(note) : res.status(404).end())  
    .catch( err => next(err))
})

notesRouter.post('/', userExtractor, dataVerify, async(req, res, next)=>{
  const {
    title = "",
    content = "",
    important = false 
  } = req.body

  const {userId} = req

  const user = await User.findById(userId)

  const note = new Note({
    title,
    content,
    date: new Date(),
    important,
    user : user._id
  })

  note.save()
    .then( savedNote => {
      user.notes = user.notes.concat(savedNote._id)
      user.save()
      res.status(201).json(savedNote)
    })
    .catch(err => {
      console.log("err save", err)
      res.status(503).end()
    })
})

notesRouter.put('/:id', userExtractor, dataVerify, async(req, res, next)=>{
  const {body, userId} = req
  const {id} =  req.params 

  //verifico que el usuario sea el dueño de la nota
  const note = await Note.findById(id)
  if (note.user != userId ) return res.status(401).end()


  Note.findByIdAndUpdate( id, {...body}, {new: true})
    .then(newNote => res.status(201).json(newNote))
      .catch(err => next(err))

})

notesRouter.delete('/:id', (req, res, next)=>{
  const {id} = req.params
  Note.findByIdAndDelete(id).then(() => res.status(204).end()).catch(err=>next(err))
})


module.exports = notesRouter